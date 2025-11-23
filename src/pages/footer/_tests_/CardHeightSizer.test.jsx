import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CardHeightSizer from "../CardHeightSizer";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));
vi.mock("html-react-parser", () => ({
  default: (str) => str,
}));

describe("CardHeightSizer", () => {
  const mockSetCardHeightSort = vi.fn();
  const mockSetCardHeightPostsort = vi.fn();
  const mockSetCardHeightThin = vi.fn();

  const mockLangObj = {
    cardHeightText: "Card Height:",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};

      return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: vi.fn((key) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        }),
        get length() {
          return Object.keys(store).length;
        },
        key: vi.fn((index) => {
          const keys = Object.keys(store);
          return keys[index] || null;
        }),
      };
    })();

    // Replace global localStorage
    window.localStorage = localStorageMock;

    // Mock useSettingsStore
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: mockLangObj,
      };
      return selector(state);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupStore = (page, heights = {}) => {
    useStore.mockImplementation((selector) => {
      const state = {
        currentPage: page,
        cardHeightSort: heights.sort || 100,
        cardHeightPostsort: heights.postsort || 100,
        cardHeightThin: heights.thin || 100,
        setCardHeightSort: mockSetCardHeightSort,
        setCardHeightPostsort: mockSetCardHeightPostsort,
        setCardHeightThin: mockSetCardHeightThin,
      };
      return selector(state);
    });
  };

  describe("rendering", () => {
    it("renders the component with card height text", () => {
      setupStore("sort");
      render(<CardHeightSizer />);

      expect(screen.getByText("Card Height:")).toBeInTheDocument();
    });

    it("renders with correct test id", () => {
      setupStore("sort");
      render(<CardHeightSizer />);

      expect(screen.getByTestId("CardHeightSizerDiv")).toBeInTheDocument();
    });

    it("renders increase and decrease buttons", () => {
      setupStore("sort");
      render(<CardHeightSizer />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent("-");
      expect(buttons[1]).toHaveTextContent("+");
    });

    it("renders empty string when cardHeightText is missing", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: {
            cardHeightText: undefined,
          },
        };
        return selector(state);
      });
      setupStore("sort");

      const { container } = render(<CardHeightSizer />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("sort page functionality", () => {
    it("increases card height on sort page", () => {
      setupStore("sort", { sort: 100 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightSort).toHaveBeenCalledWith(102);
      expect(localStorage.getItem("cardHeightSort")).toBe("102");
    });

    it("decreases card height on sort page", () => {
      setupStore("sort", { sort: 100 });
      render(<CardHeightSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetCardHeightSort).toHaveBeenCalledWith(98);
      expect(localStorage.getItem("cardHeightSort")).toBe("98");
    });

    it("uses localStorage value for sort page if available", () => {
      localStorage.setItem("cardHeightSort", "120");
      setupStore("sort", { sort: 100 });

      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightSort).toHaveBeenCalledWith(122);
    });
  });

  describe("postsort page functionality", () => {
    it("increases card height on postsort page", () => {
      setupStore("postsort", { postsort: 100 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightPostsort).toHaveBeenCalledWith(102);
      expect(localStorage.getItem("cardHeightPostsort")).toBe("102");
    });

    it("decreases card height on postsort page", () => {
      setupStore("postsort", { postsort: 100 });
      render(<CardHeightSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetCardHeightPostsort).toHaveBeenCalledWith(98);
      expect(localStorage.getItem("cardHeightPostsort")).toBe("98");
    });

    it("uses localStorage value for postsort page if available", () => {
      localStorage.setItem("cardHeightPostsort", "150");
      setupStore("postsort", { postsort: 100 });

      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightPostsort).toHaveBeenCalledWith(152);
    });
  });

  describe("thin page functionality", () => {
    it("increases card height on thin page", () => {
      setupStore("thin", { thin: 100 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightThin).toHaveBeenCalledWith(105);
      expect(localStorage.getItem("cardHeightThin")).toBe("105");
    });

    it("decreases card height on thin page", () => {
      setupStore("thin", { thin: 100 });
      render(<CardHeightSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetCardHeightThin).toHaveBeenCalledWith(95);
      expect(localStorage.getItem("cardHeightThin")).toBe("95");
    });

    it("uses localStorage value for thin page if available", () => {
      localStorage.setItem("cardHeightThin", "80");
      setupStore("thin", { thin: 100 });

      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightThin).toHaveBeenCalledWith(85);
    });
  });

  describe("increment amounts", () => {
    it("increments by 2 for sort page", () => {
      setupStore("sort", { sort: 50 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightSort).toHaveBeenCalledWith(52);
    });

    it("increments by 2 for postsort page", () => {
      setupStore("postsort", { postsort: 50 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightPostsort).toHaveBeenCalledWith(52);
    });

    it("increments by 5 for thin page", () => {
      setupStore("thin", { thin: 50 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightThin).toHaveBeenCalledWith(55);
    });
  });

  describe("edge cases", () => {
    it("handles string values from localStorage", () => {
      localStorage.setItem("cardHeightSort", "100");
      setupStore("sort", { sort: 50 });

      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightSort).toHaveBeenCalledWith(102);
    });

    it("does nothing when clicked on unknown page", () => {
      setupStore("unknown", { sort: 100 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightSort).not.toHaveBeenCalled();
      expect(mockSetCardHeightPostsort).not.toHaveBeenCalled();
      expect(mockSetCardHeightThin).not.toHaveBeenCalled();
    });

    it("handles undefined currentPage", () => {
      setupStore(undefined, { sort: 100 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetCardHeightSort).not.toHaveBeenCalled();
    });

    it("handles null currentPage", () => {
      setupStore(null, { sort: 100 });
      render(<CardHeightSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetCardHeightSort).not.toHaveBeenCalled();
    });
  });

  describe("localStorage persistence", () => {
    it("saves to localStorage on sort page increase", () => {
      setupStore("sort", { sort: 100 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(localStorage.getItem("cardHeightSort")).toBe("102");
    });

    it("saves to localStorage on postsort page decrease", () => {
      setupStore("postsort", { postsort: 100 });
      render(<CardHeightSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(localStorage.getItem("cardHeightPostsort")).toBe("98");
    });

    it("saves to localStorage on thin page increase", () => {
      setupStore("thin", { thin: 100 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(localStorage.getItem("cardHeightThin")).toBe("105");
    });

    it("overwrites existing localStorage value", () => {
      localStorage.setItem("cardHeightSort", "100");
      setupStore("sort", { sort: 100 });

      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(localStorage.getItem("cardHeightSort")).toBe("102");
    });
  });

  describe("accessibility", () => {
    it("buttons are keyboard accessible", () => {
      setupStore("sort", { sort: 100 });
      render(<CardHeightSizer />);

      const increaseButton = screen.getByText("+");
      increaseButton.focus();

      expect(document.activeElement).toBe(increaseButton);
    });
  });
});

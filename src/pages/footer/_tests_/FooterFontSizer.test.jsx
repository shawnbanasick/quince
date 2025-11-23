import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import FooterFontSizer from "../FooterFontSizer";
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

describe("FooterFontSizer", () => {
  const mockSetCardFontSizeSort = vi.fn();
  const mockSetCardFontSizePostsort = vi.fn();
  const mockSetCardFontSizePresort = vi.fn();
  const mockSetCardFontSizeThin = vi.fn();

  const mockLangObj = {
    fontSizeText: "Font Size:",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Clear console.log mock if it exists
    if (console.log.mockRestore) {
      console.log.mockRestore();
    }

    // Mock useSettingsStore
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: mockLangObj,
      };
      return selector(state);
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  const setupStore = (page, fontSizes = {}) => {
    useStore.mockImplementation((selector) => {
      const state = {
        currentPage: page,
        cardFontSizeSort: fontSizes.sort || 16,
        cardFontSizePostsort: fontSizes.postsort || 16,
        cardFontSizePresort: fontSizes.presort || 16,
        cardFontSizeThin: fontSizes.thin || 16,
        setCardFontSizeSort: mockSetCardFontSizeSort,
        setCardFontSizePostsort: mockSetCardFontSizePostsort,
        setCardFontSizePresort: mockSetCardFontSizePresort,
        setCardFontSizeThin: mockSetCardFontSizeThin,
      };
      return selector(state);
    });
  };

  describe("rendering", () => {
    it("renders the component with font size text", () => {
      setupStore("sort");
      render(<FooterFontSizer />);

      expect(screen.getByText("Font Size:")).toBeInTheDocument();
    });

    it("renders with correct test id", () => {
      setupStore("sort");
      render(<FooterFontSizer />);

      expect(screen.getByTestId("FooterFontSizerDiv")).toBeInTheDocument();
    });

    it("renders increase and decrease buttons with test ids", () => {
      setupStore("sort");
      render(<FooterFontSizer />);

      expect(screen.getByTestId("FooterFontSizerNeg")).toBeInTheDocument();
      expect(screen.getByTestId("FooterFontSizerPos")).toBeInTheDocument();
    });

    it("renders buttons with correct text", () => {
      setupStore("sort");
      render(<FooterFontSizer />);

      const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
      const increaseButton = screen.getByTestId("FooterFontSizerPos");

      expect(decreaseButton).toHaveTextContent("-");
      expect(increaseButton).toHaveTextContent("+");
    });

    it("renders empty string when fontSizeText is missing", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: {
            fontSizeText: undefined,
          },
        };
        return selector(state);
      });
      setupStore("sort");

      const { container } = render(<FooterFontSizer />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("presort page functionality", () => {
    it("increases font size on presort page", () => {
      setupStore("presort", { presort: 16 });
      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(mockSetCardFontSizePresort).toHaveBeenCalledWith(17);
      expect(localStorage.getItem("fontSizePresort")).toBe("17");
    });

    it("decreases font size on presort page", () => {
      setupStore("presort", { presort: 16 });
      render(<FooterFontSizer />);

      const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
      fireEvent.click(decreaseButton);

      expect(mockSetCardFontSizePresort).toHaveBeenCalledWith(15);
      expect(localStorage.getItem("fontSizePresort")).toBe("15");
    });

    it("uses localStorage value for presort page if available", () => {
      localStorage.setItem("fontSizePresort", "20");
      setupStore("presort", { presort: 16 });

      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(mockSetCardFontSizePresort).toHaveBeenCalledWith(21);
    });
  });

  describe("thin page functionality", () => {
    it("increases font size on thin page", () => {
      setupStore("thin", { thin: 16 });
      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(mockSetCardFontSizeThin).toHaveBeenCalledWith(17);
      expect(localStorage.getItem("fontSizeThin")).toBe("17");
    });

    it("decreases font size on thin page", () => {
      setupStore("thin", { thin: 16 });
      render(<FooterFontSizer />);

      const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
      fireEvent.click(decreaseButton);

      expect(mockSetCardFontSizeThin).toHaveBeenCalledWith(15);
      expect(localStorage.getItem("fontSizeThin")).toBe("15");
    });
  });

  describe("sort page functionality", () => {
    it("increases font size on sort page", () => {
      setupStore("sort", { sort: 16 });
      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(mockSetCardFontSizeSort).toHaveBeenCalledWith(17);
      expect(localStorage.getItem("fontSizeSort")).toBe("17");
    });

    it("decreases font size on sort page", () => {
      setupStore("sort", { sort: 16 });
      render(<FooterFontSizer />);

      const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
      fireEvent.click(decreaseButton);

      expect(mockSetCardFontSizeSort).toHaveBeenCalledWith(15);
      expect(localStorage.getItem("fontSizeSort")).toBe("15");
    });

    it("uses localStorage value for sort page if available", () => {
      localStorage.setItem("fontSizeSort", "18");
      setupStore("sort", { sort: 16 });

      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(mockSetCardFontSizeSort).toHaveBeenCalledWith(19);
    });
  });

  describe("postsort page functionality", () => {
    it("increases font size on postsort page", () => {
      setupStore("postsort", { postsort: 16 });
      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(mockSetCardFontSizePostsort).toHaveBeenCalledWith(17);
      expect(localStorage.getItem("fontSizePostsort")).toBe("17");
    });

    it("decreases font size on postsort page", () => {
      setupStore("postsort", { postsort: 16 });
      render(<FooterFontSizer />);

      const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
      fireEvent.click(decreaseButton);

      expect(mockSetCardFontSizePostsort).toHaveBeenCalledWith(15);
      expect(localStorage.getItem("fontSizePostsort")).toBe("15");
    });

    it("uses localStorage value for postsort page if available", () => {
      localStorage.setItem("fontSizePostsort", "22");
      setupStore("postsort", { postsort: 16 });

      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(mockSetCardFontSizePostsort).toHaveBeenCalledWith(23);
    });
  });

  describe("increment amounts", () => {
    it("increments by 1 for all pages", () => {
      const pages = ["presort", "thin", "sort", "postsort"];
      const setters = [
        mockSetCardFontSizePresort,
        mockSetCardFontSizeThin,
        mockSetCardFontSizeSort,
        mockSetCardFontSizePostsort,
      ];

      pages.forEach((page, index) => {
        vi.clearAllMocks();
        setupStore(page, { [page]: 16 });
        const { unmount } = render(<FooterFontSizer />);

        const increaseButton = screen.getByTestId("FooterFontSizerPos");
        fireEvent.click(increaseButton);

        expect(setters[index]).toHaveBeenCalledWith(17);
        unmount();
      });
    });

    it("decrements by 1 for all pages", () => {
      const pages = ["presort", "thin", "sort", "postsort"];
      const setters = [
        mockSetCardFontSizePresort,
        mockSetCardFontSizeThin,
        mockSetCardFontSizeSort,
        mockSetCardFontSizePostsort,
      ];

      pages.forEach((page, index) => {
        vi.clearAllMocks();
        setupStore(page, { [page]: 16 });
        const { unmount } = render(<FooterFontSizer />);

        const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
        fireEvent.click(decreaseButton);

        expect(setters[index]).toHaveBeenCalledWith(15);
        unmount();
      });
    });
  });

  describe("console.log behavior", () => {
    it("logs 'decreaseFontSize' when decrease button is clicked", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      setupStore("sort", { sort: 16 });
      render(<FooterFontSizer />);

      const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
      fireEvent.click(decreaseButton);

      expect(consoleSpy).toHaveBeenCalledWith("decreaseFontSize");
      consoleSpy.mockRestore();
    });
  });

  describe("edge cases", () => {
    it("handles very large font size", () => {
      setupStore("sort", { sort: 100 });
      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(mockSetCardFontSizeSort).toHaveBeenCalledWith(101);
    });

    it("does nothing when clicked on unknown page", () => {
      setupStore("unknown", { sort: 16 });
      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(mockSetCardFontSizeSort).not.toHaveBeenCalled();
      expect(mockSetCardFontSizePostsort).not.toHaveBeenCalled();
      expect(mockSetCardFontSizePresort).not.toHaveBeenCalled();
      expect(mockSetCardFontSizeThin).not.toHaveBeenCalled();
    });

    it("handles undefined currentPage", () => {
      setupStore(undefined, { sort: 16 });
      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(mockSetCardFontSizeSort).not.toHaveBeenCalled();
    });

    it("handles null currentPage", () => {
      setupStore(null, { sort: 16 });
      render(<FooterFontSizer />);

      const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
      fireEvent.click(decreaseButton);

      expect(mockSetCardFontSizeSort).not.toHaveBeenCalled();
    });

    it("handles NaN from localStorage", () => {
      localStorage.setItem("fontSizeSort", "not-a-number");
      setupStore("sort", { sort: 16 });

      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      // Should use store value (16) when localStorage is NaN
      expect(mockSetCardFontSizeSort).toHaveBeenCalledWith(17);
    });
  });

  describe("localStorage persistence", () => {
    it("saves to localStorage on presort page increase", () => {
      setupStore("presort", { presort: 16 });
      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(localStorage.getItem("fontSizePresort")).toBe("17");
    });

    it("saves to localStorage on thin page decrease", () => {
      setupStore("thin", { thin: 16 });
      render(<FooterFontSizer />);

      const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
      fireEvent.click(decreaseButton);

      expect(localStorage.getItem("fontSizeThin")).toBe("15");
    });

    it("saves to localStorage on sort page increase", () => {
      setupStore("sort", { sort: 16 });
      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(localStorage.getItem("fontSizeSort")).toBe("17");
    });

    it("saves to localStorage on postsort page decrease", () => {
      setupStore("postsort", { postsort: 16 });
      render(<FooterFontSizer />);

      const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
      fireEvent.click(decreaseButton);

      expect(localStorage.getItem("fontSizePostsort")).toBe("15");
    });

    it("overwrites existing localStorage value", () => {
      localStorage.setItem("fontSizeSort", "10");
      setupStore("sort", { sort: 16 });

      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      expect(localStorage.getItem("fontSizeSort")).toBe("11");
    });

    it("only uses localStorage for matching page", () => {
      localStorage.setItem("fontSizeSort", "20");
      setupStore("presort", { presort: 16 });

      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      fireEvent.click(increaseButton);

      // Should use presort value (16), not sort localStorage (20)
      expect(mockSetCardFontSizePresort).toHaveBeenCalledWith(17);
    });
  });

  describe("accessibility", () => {
    it("buttons are keyboard accessible", () => {
      setupStore("sort", { sort: 16 });
      render(<FooterFontSizer />);

      const increaseButton = screen.getByTestId("FooterFontSizerPos");
      increaseButton.focus();

      expect(document.activeElement).toBe(increaseButton);
    });

    it("both buttons can receive focus", () => {
      setupStore("sort");
      render(<FooterFontSizer />);

      const decreaseButton = screen.getByTestId("FooterFontSizerNeg");
      const increaseButton = screen.getByTestId("FooterFontSizerPos");

      decreaseButton.focus();
      expect(document.activeElement).toBe(decreaseButton);

      increaseButton.focus();
      expect(document.activeElement).toBe(increaseButton);
    });
  });
});

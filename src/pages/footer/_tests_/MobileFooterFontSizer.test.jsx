import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MobileFooterFontSizer from "../MobileFooterFontSizer";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((text) => text),
}));
vi.mock("html-react-parser", () => ({
  default: vi.fn((text) => text),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();

window.localStorage = localStorageMock;

describe("MobileFooterFontSizer", () => {
  let mockSetMobilePresortFontSize;
  let mockSetMobileThinFontSize;
  let mockSetMobileSortFontSize;
  let mockSetMobilePostsortFontSize;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    localStorageMock.clear();

    // Setup mock functions
    mockSetMobilePresortFontSize = vi.fn();
    mockSetMobileThinFontSize = vi.fn();
    mockSetMobileSortFontSize = vi.fn();
    mockSetMobilePostsortFontSize = vi.fn();

    // Mock useSettingsStore
    useSettingsStore.mockReturnValue({
      mobileTextSize: "Text Size",
    });

    // Mock useStore with default values
    useStore.mockImplementation((selector) => {
      const mockState = {
        currentPage: "presort",
        setMobilePresortFontSize: mockSetMobilePresortFontSize,
        setMobileThinFontSize: mockSetMobileThinFontSize,
        setMobileSortFontSize: mockSetMobileSortFontSize,
        setMobilePostsortFontSize: mockSetMobilePostsortFontSize,
      };
      return selector(mockState);
    });

    // Initialize localStorage with default font sizes
    localStorage.setItem(
      "m_FontSizeObject",
      JSON.stringify({
        presort: 2,
        thin: 2,
        sort: 2,
        postsort: 2,
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component with all elements", () => {
      render(<MobileFooterFontSizer />);

      expect(screen.getByText("-")).toBeInTheDocument();
      expect(screen.getByText("+")).toBeInTheDocument();
      expect(screen.getByText("Text Size")).toBeInTheDocument();
    });

    it("should render the localized text from langObj", () => {
      useSettingsStore.mockReturnValue({
        mobileTextSize: "Tamaño del texto",
      });

      render(<MobileFooterFontSizer />);

      expect(screen.getByText("Tamaño del texto")).toBeInTheDocument();
    });
  });

  describe("Increase Font Size - Presort Page", () => {
    it("should increase presort font size when on presort page", () => {
      render(<MobileFooterFontSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortFontSize).toHaveBeenCalledWith("2.1");
    });

    it("should update localStorage when increasing presort font size", () => {
      render(<MobileFooterFontSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      const storedData = JSON.parse(localStorage.getItem("m_FontSizeObject"));
      expect(storedData.presort).toBe("2.1");
    });

    it("should increase presort font size multiple times", () => {
      render(<MobileFooterFontSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortFontSize).toHaveBeenCalledTimes(2);
      expect(mockSetMobilePresortFontSize).toHaveBeenLastCalledWith("2.2");
    });
  });

  describe("Decrease Font Size - Presort Page", () => {
    it("should decrease presort font size when on presort page", () => {
      render(<MobileFooterFontSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetMobilePresortFontSize).toHaveBeenCalledWith("1.9");
    });

    it("should update localStorage when decreasing presort font size", () => {
      render(<MobileFooterFontSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      const storedData = JSON.parse(localStorage.getItem("m_FontSizeObject"));
      expect(storedData.presort).toBe("1.9");
    });
  });

  describe("Thin Page Font Size", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "thin",
          setMobilePresortFontSize: mockSetMobilePresortFontSize,
          setMobileThinFontSize: mockSetMobileThinFontSize,
          setMobileSortFontSize: mockSetMobileSortFontSize,
          setMobilePostsortFontSize: mockSetMobilePostsortFontSize,
        };
        return selector(mockState);
      });
    });

    it("should increase thin font size when on thin page", () => {
      render(<MobileFooterFontSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobileThinFontSize).toHaveBeenCalledWith("2.1");
    });

    it("should decrease thin font size when on thin page", () => {
      render(<MobileFooterFontSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetMobileThinFontSize).toHaveBeenCalledWith("1.9");
    });
  });

  describe("Sort Page Font Size", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "sort",
          setMobilePresortFontSize: mockSetMobilePresortFontSize,
          setMobileThinFontSize: mockSetMobileThinFontSize,
          setMobileSortFontSize: mockSetMobileSortFontSize,
          setMobilePostsortFontSize: mockSetMobilePostsortFontSize,
        };
        return selector(mockState);
      });
    });

    it("should increase sort font size when on sort page", () => {
      render(<MobileFooterFontSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobileSortFontSize).toHaveBeenCalledWith("2.1");
    });

    it("should decrease sort font size when on sort page", () => {
      render(<MobileFooterFontSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetMobileSortFontSize).toHaveBeenCalledWith("1.9");
    });
  });

  describe("Postsort Page Font Size", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "postsort",
          setMobilePresortFontSize: mockSetMobilePresortFontSize,
          setMobileThinFontSize: mockSetMobileThinFontSize,
          setMobileSortFontSize: mockSetMobileSortFontSize,
          setMobilePostsortFontSize: mockSetMobilePostsortFontSize,
        };
        return selector(mockState);
      });
    });

    it("should increase postsort font size when on postsort page", () => {
      render(<MobileFooterFontSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobilePostsortFontSize).toHaveBeenCalledWith("2.1");
    });

    it("should decrease postsort font size when on postsort page", () => {
      render(<MobileFooterFontSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetMobilePostsortFontSize).toHaveBeenCalledWith("1.9");
    });
  });

  describe("LocalStorage Integration", () => {
    it("should load initial font sizes from localStorage", () => {
      const customSizes = {
        presort: 2.5,
        thin: 1.8,
        sort: 2.2,
        postsort: 1.9,
      };
      localStorage.setItem("m_FontSizeObject", JSON.stringify(customSizes));

      render(<MobileFooterFontSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortFontSize).toHaveBeenCalledWith("2.6");
    });

    it("should preserve unchanged page sizes when updating one page", () => {
      render(<MobileFooterFontSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      const storedData = JSON.parse(localStorage.getItem("m_FontSizeObject"));
      expect(storedData.presort).toBe("2.1");
      expect(storedData.thin).toBe(2);
      expect(storedData.sort).toBe(2);
      expect(storedData.postsort).toBe(2);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty langObj mobileTextSize", () => {
      useSettingsStore.mockReturnValue({
        mobileTextSize: null,
      });

      render(<MobileFooterFontSizer />);

      // Should not throw error and still render buttons
      expect(screen.getByText("-")).toBeInTheDocument();
      expect(screen.getByText("+")).toBeInTheDocument();
    });

    it("should not update when clicking on unknown page", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "unknownPage",
          setMobilePresortFontSize: mockSetMobilePresortFontSize,
          setMobileThinFontSize: mockSetMobileThinFontSize,
          setMobileSortFontSize: mockSetMobileSortFontSize,
          setMobilePostsortFontSize: mockSetMobilePostsortFontSize,
        };
        return selector(mockState);
      });

      render(<MobileFooterFontSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortFontSize).not.toHaveBeenCalled();
      expect(mockSetMobileThinFontSize).not.toHaveBeenCalled();
      expect(mockSetMobileSortFontSize).not.toHaveBeenCalled();
      expect(mockSetMobilePostsortFontSize).not.toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MobileFooterViewSizer from "../MobileFooterViewSizer";
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

describe("MobileFooterViewSizer", () => {
  let mockSetMobilePresortViewSize;
  let mockSetMobileThinViewSize;
  let mockSetMobileSortViewSize;
  let mockSetMobilePostsortViewSize;
  let mockSetMobileSurveyViewSize;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    localStorageMock.clear();

    // Setup mock functions
    mockSetMobilePresortViewSize = vi.fn();
    mockSetMobileThinViewSize = vi.fn();
    mockSetMobileSortViewSize = vi.fn();
    mockSetMobilePostsortViewSize = vi.fn();
    mockSetMobileSurveyViewSize = vi.fn();

    // Mock useSettingsStore
    useSettingsStore.mockReturnValue({
      mobileViewSize: "View Size",
    });

    // Mock useStore with default values
    useStore.mockImplementation((selector) => {
      const mockState = {
        currentPage: "presort",
        setMobilePresortViewSize: mockSetMobilePresortViewSize,
        setMobileThinViewSize: mockSetMobileThinViewSize,
        setMobileSortViewSize: mockSetMobileSortViewSize,
        setMobilePostsortViewSize: mockSetMobilePostsortViewSize,
        setMobileSurveyViewSize: mockSetMobileSurveyViewSize,
      };
      return selector(mockState);
    });

    // Initialize localStorage with default view sizes
    localStorage.setItem(
      "m_ViewSizeObject",
      JSON.stringify({
        presort: 42,
        thin: 68,
        sort: 72,
        postsort: 42,
        survey: 72,
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component with all elements", () => {
      render(<MobileFooterViewSizer />);

      expect(screen.getByText("-")).toBeInTheDocument();
      expect(screen.getByText("+")).toBeInTheDocument();
      expect(screen.getByText("View Size")).toBeInTheDocument();
    });

    it("should render the localized text from langObj", () => {
      useSettingsStore.mockReturnValue({
        mobileViewSize: "Tamaño de vista",
      });

      render(<MobileFooterViewSizer />);

      expect(screen.getByText("Tamaño de vista")).toBeInTheDocument();
    });
  });

  describe("Increase View Size - Presort Page", () => {
    it("should increase presort view size when on presort page", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortViewSize).toHaveBeenCalledWith("44.00");
    });

    it("should update localStorage when increasing presort view size", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      const storedData = JSON.parse(localStorage.getItem("m_ViewSizeObject"));
      expect(storedData.presort).toBe("44.00");
    });

    it("should increase presort view size multiple times", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortViewSize).toHaveBeenCalledTimes(2);
      expect(mockSetMobilePresortViewSize).toHaveBeenLastCalledWith("46.00");
    });
  });

  describe("Decrease View Size - Presort Page", () => {
    it("should decrease presort view size when on presort page", () => {
      render(<MobileFooterViewSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetMobilePresortViewSize).toHaveBeenCalledWith("40.00");
    });

    it("should update localStorage when decreasing presort view size", () => {
      render(<MobileFooterViewSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      const storedData = JSON.parse(localStorage.getItem("m_ViewSizeObject"));
      expect(storedData.presort).toBe("40.00");
    });

    it("should allow decreasing view size to very small values", () => {
      render(<MobileFooterViewSizer />);

      const decreaseButton = screen.getByText("-");
      // Click 20 times to go from 42 to 2
      for (let i = 0; i < 20; i++) {
        fireEvent.click(decreaseButton);
      }

      expect(mockSetMobilePresortViewSize).toHaveBeenLastCalledWith("2.000");
    });
  });

  describe("Thin Page View Size", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "thin",
          setMobilePresortViewSize: mockSetMobilePresortViewSize,
          setMobileThinViewSize: mockSetMobileThinViewSize,
          setMobileSortViewSize: mockSetMobileSortViewSize,
          setMobilePostsortViewSize: mockSetMobilePostsortViewSize,
          setMobileSurveyViewSize: mockSetMobileSurveyViewSize,
        };
        return selector(mockState);
      });
    });

    it("should increase thin view size when on thin page", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobileThinViewSize).toHaveBeenCalledWith("70.00");
    });

    it("should decrease thin view size when on thin page", () => {
      render(<MobileFooterViewSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetMobileThinViewSize).toHaveBeenCalledWith("66.00");
    });

    it("should update localStorage with correct thin value", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      const storedData = JSON.parse(localStorage.getItem("m_ViewSizeObject"));
      expect(storedData.thin).toBe("70.00");
      expect(storedData.presort).toBe(42);
    });
  });

  describe("Sort Page View Size", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "sort",
          setMobilePresortViewSize: mockSetMobilePresortViewSize,
          setMobileThinViewSize: mockSetMobileThinViewSize,
          setMobileSortViewSize: mockSetMobileSortViewSize,
          setMobilePostsortViewSize: mockSetMobilePostsortViewSize,
          setMobileSurveyViewSize: mockSetMobileSurveyViewSize,
        };
        return selector(mockState);
      });
    });

    it("should increase sort view size when on sort page", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobileSortViewSize).toHaveBeenCalledWith("74.00");
    });

    it("should decrease sort view size when on sort page", () => {
      render(<MobileFooterViewSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetMobileSortViewSize).toHaveBeenCalledWith("70.00");
    });
  });

  describe("Postsort Page View Size", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "postsort",
          setMobilePresortViewSize: mockSetMobilePresortViewSize,
          setMobileThinViewSize: mockSetMobileThinViewSize,
          setMobileSortViewSize: mockSetMobileSortViewSize,
          setMobilePostsortViewSize: mockSetMobilePostsortViewSize,
          setMobileSurveyViewSize: mockSetMobileSurveyViewSize,
        };
        return selector(mockState);
      });
    });

    it("should increase postsort view size when on postsort page", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobilePostsortViewSize).toHaveBeenCalledWith("44.00");
    });

    it("should decrease postsort view size when on postsort page", () => {
      render(<MobileFooterViewSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetMobilePostsortViewSize).toHaveBeenCalledWith("40.00");
    });
  });

  describe("Survey Page View Size", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "survey",
          setMobilePresortViewSize: mockSetMobilePresortViewSize,
          setMobileThinViewSize: mockSetMobileThinViewSize,
          setMobileSortViewSize: mockSetMobileSortViewSize,
          setMobilePostsortViewSize: mockSetMobilePostsortViewSize,
          setMobileSurveyViewSize: mockSetMobileSurveyViewSize,
        };
        return selector(mockState);
      });
    });

    it("should increase survey view size when on survey page", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobileSurveyViewSize).toHaveBeenCalledWith("74.00");
    });

    it("should decrease survey view size when on survey page", () => {
      render(<MobileFooterViewSizer />);

      const decreaseButton = screen.getByText("-");
      fireEvent.click(decreaseButton);

      expect(mockSetMobileSurveyViewSize).toHaveBeenCalledWith("70.00");
    });

    it("should update localStorage with correct survey value", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      const storedData = JSON.parse(localStorage.getItem("m_ViewSizeObject"));
      expect(storedData.survey).toBe("74.00");
    });
  });

  describe("LocalStorage Integration", () => {
    it("should load initial view sizes from localStorage", () => {
      const customSizes = {
        presort: 50,
        thin: 80,
        sort: 90,
        postsort: 45,
        survey: 85,
      };
      localStorage.setItem("m_ViewSizeObject", JSON.stringify(customSizes));

      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortViewSize).toHaveBeenCalledWith("52.00");
    });

    it("should preserve unchanged page sizes when updating one page", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      const storedData = JSON.parse(localStorage.getItem("m_ViewSizeObject"));
      expect(storedData.presort).toBe("44.00");
      expect(storedData.thin).toBe(68);
      expect(storedData.sort).toBe(72);
      expect(storedData.postsort).toBe(42);
      expect(storedData.survey).toBe(72);
    });

    it("should handle localStorage with missing properties", () => {
      localStorage.setItem(
        "m_ViewSizeObject",
        JSON.stringify({
          presort: 50,
          // Missing other properties
        })
      );

      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      // Should still work with available data
      expect(mockSetMobilePresortViewSize).toHaveBeenCalledWith("52.00");
    });
  });

  describe("Precision Handling", () => {
    it("should maintain 4 significant figures with toPrecision(4)", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortViewSize).toHaveBeenCalledWith("44.00");
    });

    it("should handle larger numbers with correct precision", () => {
      localStorage.setItem(
        "m_ViewSizeObject",
        JSON.stringify({
          presort: 98,
          thin: 68,
          sort: 72,
          postsort: 42,
          survey: 72,
        })
      );

      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortViewSize).toHaveBeenCalledWith("100.0");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty langObj mobileViewSize", () => {
      useSettingsStore.mockReturnValue({
        mobileViewSize: null,
      });

      render(<MobileFooterViewSizer />);

      // Should not throw error and still render buttons
      expect(screen.getByText("-")).toBeInTheDocument();
      expect(screen.getByText("+")).toBeInTheDocument();
    });

    it("should not update when clicking on unknown page", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "unknownPage",
          setMobilePresortViewSize: mockSetMobilePresortViewSize,
          setMobileThinViewSize: mockSetMobileThinViewSize,
          setMobileSortViewSize: mockSetMobileSortViewSize,
          setMobilePostsortViewSize: mockSetMobilePostsortViewSize,
          setMobileSurveyViewSize: mockSetMobileSurveyViewSize,
        };
        return selector(mockState);
      });

      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortViewSize).not.toHaveBeenCalled();
      expect(mockSetMobileThinViewSize).not.toHaveBeenCalled();
      expect(mockSetMobileSortViewSize).not.toHaveBeenCalled();
      expect(mockSetMobilePostsortViewSize).not.toHaveBeenCalled();
      expect(mockSetMobileSurveyViewSize).not.toHaveBeenCalled();
    });

    it("should handle rapid consecutive clicks", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");

      // Rapid fire clicks
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);

      expect(mockSetMobilePresortViewSize).toHaveBeenCalledTimes(5);
      expect(mockSetMobilePresortViewSize).toHaveBeenLastCalledWith("52.00");
    });

    it("should handle alternating increase and decrease", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      const decreaseButton = screen.getByText("-");

      fireEvent.click(increaseButton); // 44
      fireEvent.click(increaseButton); // 46
      fireEvent.click(decreaseButton); // 44
      fireEvent.click(decreaseButton); // 42

      expect(mockSetMobilePresortViewSize).toHaveBeenCalledTimes(4);
      expect(mockSetMobilePresortViewSize).toHaveBeenLastCalledWith("42.00");
    });
  });

  describe("Cross-page Independence", () => {
    it("should not affect other pages when changing presort size", () => {
      render(<MobileFooterViewSizer />);

      const increaseButton = screen.getByText("+");
      fireEvent.click(increaseButton);

      const storedData = JSON.parse(localStorage.getItem("m_ViewSizeObject"));

      // Only presort should change
      expect(storedData.presort).toBe("44.00");
      expect(storedData.thin).toBe(68);
      expect(storedData.sort).toBe(72);
      expect(storedData.postsort).toBe(42);
      expect(storedData.survey).toBe(72);
    });

    it("should maintain independent sizes for each page", () => {
      const { rerender } = render(<MobileFooterViewSizer />);

      // Increase presort
      fireEvent.click(screen.getByText("+"));

      // Switch to thin page
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "thin",
          setMobilePresortViewSize: mockSetMobilePresortViewSize,
          setMobileThinViewSize: mockSetMobileThinViewSize,
          setMobileSortViewSize: mockSetMobileSortViewSize,
          setMobilePostsortViewSize: mockSetMobilePostsortViewSize,
          setMobileSurveyViewSize: mockSetMobileSurveyViewSize,
        };
        return selector(mockState);
      });

      rerender(<MobileFooterViewSizer />);

      // Decrease thin
      fireEvent.click(screen.getByText("-"));

      const storedData = JSON.parse(localStorage.getItem("m_ViewSizeObject"));
      expect(storedData.presort).toBe("44.00");
      expect(storedData.thin).toBe("66.00");
    });
  });
});

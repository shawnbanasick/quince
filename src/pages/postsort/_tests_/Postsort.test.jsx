import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Postsort from "../Postsort";
import useStore from "../../../globalState/useStore";
import useSettingsStore from "../../../globalState/useSettingsStore";
import calculateTimeOnPage from "../../../utilities/calculateTimeOnPage";

// 1. Mock the custom hooks/stores
vi.mock("../../../globalState/useStore");
vi.mock("../../../globalState/useSettingsStore");

// 2. Mock utility functions
vi.mock("../../../utilities/calculateTimeOnPage", () => ({
  default: vi.fn(),
}));

// 3. Mock sub-components to keep this a "unit" test
vi.mock("../LowCards", () => ({ default: () => <div data-testid="low-cards" /> }));
vi.mock("../LowCards2", () => ({ default: () => <div data-testid="low-cards2" /> }));
vi.mock("../HighCards", () => ({ default: () => <div data-testid="high-cards" /> }));
vi.mock("../HighCards2", () => ({ default: () => <div data-testid="high-cards2" /> }));
vi.mock("../PostsortHelpModal", () => ({ default: () => null }));
vi.mock("../PostsortPreventNavModal", () => ({ default: () => null }));
vi.mock("../../../utilities/PromptUnload", () => ({ default: () => null }));

describe("PostSort Component", () => {
  const mockSetCurrentPage = vi.fn();
  const mockSetProgressScore = vi.fn();
  const mockSetDisplayNextButton = vi.fn();

  const defaultSettings = {
    langObj: {
      postsortInstructions: "Test Instructions",
      postsortHeader: "Test Header",
      postsortAgreement: "Agree",
      postsortPlacedOn: "Placed On",
      postsortDisagreement: "Disagree",
      placeholder: "Select...",
    },
    configObj: {
      headerBarColor: "#000",
      showSecondPosColumn: true,
      showSecondNegColumn: true,
    },
    mapObj: {
      postsortConvertObj: { col1: 1, col2: 2, col3: 3, col4: 4 },
    },
  };

  beforeEach(() => {
    // Setup localStorage mock
    const mockColumnStatements = JSON.stringify({
      vCols: { 4: [], 3: [], 1: [], 2: [] },
    });
    localStorage.setItem("columnStatements", mockColumnStatements);

    // Mock Store implementations
    useSettingsStore.mockImplementation((selector) => selector(defaultSettings));
    useStore.mockImplementation((selector) => {
      const store = {
        setProgressScore: mockSetProgressScore,
        cardHeightPostsort: 100,
        cardFontSizePostsort: 16,
        setCurrentPage: mockSetCurrentPage,
        setDisplayNextButton: mockSetDisplayNextButton,
      };
      return selector(store);
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders the header and instructions from langObj", () => {
    render(<Postsort />);
    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Instructions")).toBeInTheDocument();
  });

  it("initializes page state and progress on mount", () => {
    render(<Postsort />);

    expect(mockSetCurrentPage).toHaveBeenCalledWith("postsort");
    expect(mockSetDisplayNextButton).toHaveBeenCalledWith(true);
  });

  it("calculates time on page when unmounting", () => {
    const { unmount } = render(<Postsort />);
    unmount();
    expect(calculateTimeOnPage).toHaveBeenCalled();
  });

  it("conditionally renders second columns based on configObj", () => {
    // Override config to hide second columns
    const hiddenConfig = {
      ...defaultSettings,
      configObj: {
        ...defaultSettings.configObj,
        showSecondPosColumn: false,
        showSecondNegColumn: false,
      },
    };
    useSettingsStore.mockImplementation((selector) => selector(hiddenConfig));

    render(<Postsort />);

    expect(screen.queryByTestId("high-cards2")).not.toBeInTheDocument();
    expect(screen.queryByTestId("low-cards2")).not.toBeInTheDocument();
    expect(screen.getByTestId("high-cards")).toBeInTheDocument();
  });

  it("updates localStorage with child node count on effect", () => {
    render(<Postsort />);
    // PostSort renders a title bar + Container. Inside container: instructions + 4 card components.
    // The ref is on CardsContainer. 1 (Instructions) + 4 (Cards) = 5 nodes.
    // localStorage logic: Elementcount - 1
    expect(localStorage.getItem("postsortCommentCardCount")).toBe("4");
  });
});

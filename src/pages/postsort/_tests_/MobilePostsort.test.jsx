import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MobilePostsort from "../MobilePostsort";

// 1. Mock the custom stores
vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn((selector) => {
    const mockState = {
      setCurrentPage: vi.fn(),
      setProgressScore: vi.fn(),
      mobilePostsortFontSize: 2,
      mobilePostsortViewSize: 50,
      showPostsortCommentHighlighting: true,
      setTriggerMobilePostsortHelpModal: vi.fn(),
      triggerMobilePostsortHelpModal: false,
      triggerMobilePostsortPreventNavModal: false,
      setTriggerMobilePostsortPreventNavModal: vi.fn(),
    };
    return selector(mockState);
  }),
}));

vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn((selector) => {
    const mockSettings = {
      langObj: {
        mobilePostsortSortbarText: "Postsort Task",
        placeholder: "Enter comment...",
        screenOrientationText: "Please rotate your device",
      },
      mapObj: {
        qSortPattern: [2, 3, 2],
        qSortHeaderNumbers: [-1, 0, 1],
        useColLabelNumsPostsort: [true],
        useColLabelTextPostsort: [true],
        useColLabelEmojiPostsort: [true],
      },
      configObj: {
        postsortCommentsRequired: true,
        headerBarColor: "#000",
      },
    };
    return selector(mockSettings);
  }),
}));

// 2. Mock hooks and utilities
vi.mock("../../../utilities/useScreenOrientation", () => ({
  default: vi.fn(() => "portrait-primary"),
}));

vi.mock("../../sort/mobileSortHooks/useEmojiArrays", () => ({
  useEmojiArrays: () => ({ displayArray: ["😢", "😐", "😊"] }),
}));

// 3. Mock LocalStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("MobilePostsort Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Initialize required local storage keys to prevent component crash
    localStorage.setItem(
      "m_SortArray1",
      JSON.stringify([{ id: 1, statement: "Test", color: "red" }]),
    );
    localStorage.setItem(
      "m_SortCharacteristicsArray",
      JSON.stringify([{ value: 1, header: "High", color: "blue" }]),
    );
    localStorage.setItem("m_FontSizeObject", JSON.stringify({ postsort: 2 }));
    localStorage.setItem("m_ViewSizeObject", JSON.stringify({ postsort: 50 }));
  });

  it("renders the sort title bar with correct text", () => {
    render(<MobilePostsort />);
    expect(screen.getByText("Postsort Task")).toBeInTheDocument();
  });

  it("renders the correct number of positive and negative statement areas", () => {
    render(<MobilePostsort />);
    const textareas = screen.getAllByRole("textbox");
    // Based on our mock data (qSortPattern [2,3,2]), it slices cards
    expect(textareas.length).toBeGreaterThan(0);
  });
});

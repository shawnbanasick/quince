import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PostsortHelpModal from "../PostsortHelpModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";
import "@testing-library/jest-dom"; // Ensure matchers are loaded

// 1. Mock the external stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

// Fixed the typo in the path here
vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock decodeHTML utility
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((str) => str),
}));

describe("PostsortHelpModal", () => {
  const mockSetTriggerPostsortModal = vi.fn();

  const mockLangObj = {
    postsortModalHead: "Test Header",
    postsortModalText: "Test Body Content", // Simplified for matching
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock implementation for useSettingsStore
    vi.mocked(useSettingsStore).mockImplementation((selector) =>
      selector({ langObj: mockLangObj }),
    );

    // Mock implementation for useStore
    vi.mocked(useStore).mockImplementation((selector) => {
      const state = {
        triggerPostsortModal: true,
        setTriggerPostsortModal: mockSetTriggerPostsortModal,
      };
      return selector(state);
    });
  });

  it("renders the modal with correct content when triggerPostsortModal is true", () => {
    render(<PostsortHelpModal />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    // Use findByText or a regex if the HTML tags cause splitting
    expect(screen.getByText(/Test Body Content/i)).toBeInTheDocument();
  });

  it("calls setTriggerPostsortModal(false) when the close button is clicked", () => {
    render(<PostsortHelpModal />);

    // react-responsive-modal close buttons often don't have text.
    // If getByRole("button") fails due to multiple buttons, use a specific aria-label.
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(mockSetTriggerPostsortModal).toHaveBeenCalledWith(false);
  });

  it("does not render content when triggerPostsortModal is false", () => {
    // Override store mock for this specific test
    vi.mocked(useStore).mockImplementation((selector) => {
      const state = {
        triggerPostsortModal: false,
        setTriggerPostsortModal: mockSetTriggerPostsortModal,
      };
      return selector(state);
    });

    render(<PostsortHelpModal />);

    expect(screen.queryByText("Test Header")).not.toBeInTheDocument();
  });
});

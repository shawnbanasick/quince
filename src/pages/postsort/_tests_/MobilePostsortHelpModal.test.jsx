import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MobilePostsortHelpModal from "../MobilePostsortHelpModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock decodeHTML utility
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((str) => str), // Return string as-is for simplicity
}));

describe("MobilePostsortHelpModal", () => {
  const mockSetTriggerModal = vi.fn();

  const mockLangObj = {
    mobilePostsortHelpModalHead: "Test Header",
    mobilePostsortHelpModalText: "<p>Test Body Content</p>",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default store implementations
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));

    // Handle multiple selectors for useStore
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobilePostsortHelpModal: true,
        setTriggerMobilePostsortHelpModal: mockSetTriggerModal,
      };
      return selector(state);
    });
  });

  it("renders the modal with decoded HTML content when open", () => {
    render(<MobilePostsortHelpModal />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Body Content")).toBeInTheDocument();
  });

  it("does not render content when triggerModal is false", () => {
    // Override store mock for this specific test
    useStore.mockImplementation((selector) =>
      selector({
        triggerMobilePostsortHelpModal: false,
        setTriggerMobilePostsortHelpModal: mockSetTriggerModal,
      }),
    );

    render(<MobilePostsortHelpModal />);

    expect(screen.queryByText("Test Header")).not.toBeInTheDocument();
  });

  it("calls setTriggerModal(false) when the close button is clicked", () => {
    render(<MobilePostsortHelpModal />);

    // react-responsive-modal usually provides a button with a close icon/label
    // Depending on the library version, you might need to find by aria-label
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(mockSetTriggerModal).toHaveBeenCalledWith(false);
  });
});

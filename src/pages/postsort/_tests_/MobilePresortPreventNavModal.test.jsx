import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MobilePostsortPreventNavModal from "../MobilePostsortPreventNavModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom hooks/stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock html-react-parser and decodeHTML if they cause issues in JSDOM
vi.mock("html-react-parser", () => ({
  default: (html) => html,
}));

vi.mock("../../../utilities/decodeHTML", () => ({
  default: (text) => text,
}));

describe("MobilePostsortPreventNavModal Component", () => {
  const mockSetTriggerModal = vi.fn();

  const mockLangObj = {
    mobilePostsortPreventNavModalHead: "Modal Header Title",
    mobilePostsortPreventNavModalText: "This is the modal body content.",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for useSettingsStore
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));
  });

  it("should not render the modal when triggerModal is false", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobilePostsortPreventNavModal: false,
        setTriggerMobilePostsortPreventNavModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<MobilePostsortPreventNavModal />);

    // react-responsive-modal removes content from DOM when closed
    expect(screen.queryByText("Modal Header Title")).not.toBeInTheDocument();
  });

  it("should render correctly with header and text when triggerModal is true", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobilePostsortPreventNavModal: true,
        setTriggerMobilePostsortPreventNavModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<MobilePostsortPreventNavModal />);

    expect(screen.getByText("Modal Header Title")).toBeInTheDocument();
    expect(screen.getByText("This is the modal body content.")).toBeInTheDocument();
  });

  it("should call setTriggerModal(false) when the close button is clicked", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobilePostsortPreventNavModal: true,
        setTriggerMobilePostsortPreventNavModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<MobilePostsortPreventNavModal />);

    // react-responsive-modal uses a button with a close icon by default
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(mockSetTriggerModal).toHaveBeenCalledWith(false);
  });
});

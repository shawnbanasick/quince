import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PresortFinishedModal from "../PresortFinishedModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock html-react-parser and decodeHTML to keep it simple
vi.mock("html-react-parser", () => ({
  default: (html) => html,
}));

vi.mock("../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));

describe("PresortFinishedModal Component", () => {
  const mockSetTriggerModal = vi.fn();

  const mockLangObj = {
    presortFinishedModalHead: "Success!",
    presortFinishedModalText: "Your presort is complete.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render the modal when triggerModal is false", () => {
    // Setup mocks for 'closed' state
    useSettingsStore.mockImplementation(() => mockLangObj);
    useStore.mockImplementation((selector) => {
      if (selector.name === "getTriggerModal") return false;
      if (selector.name === "getSetTriggerModal") return mockSetTriggerModal;
    });

    render(<PresortFinishedModal />);

    // react-responsive-modal doesn't render content to DOM if 'open' is false
    expect(screen.queryByText("Success!")).not.toBeInTheDocument();
  });

  it("should render correctly with localized text when open", () => {
    // Setup mocks for 'open' state
    useSettingsStore.mockImplementation(() => mockLangObj);
    useStore.mockImplementation((selector) => {
      // Logic to return different values based on which selector is passed
      if (selector.name === "getTriggerModal") return true;
      return mockSetTriggerModal;
    });

    render(<PresortFinishedModal />);

    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("Your presort is complete.")).toBeInTheDocument();
  });

  it("should call setTriggerModal(false) when the close button is clicked", () => {
    useSettingsStore.mockImplementation(() => mockLangObj);
    useStore.mockImplementation((selector) => {
      if (selector.name === "getTriggerModal") return true;
      return mockSetTriggerModal;
    });

    render(<PresortFinishedModal />);

    // react-responsive-modal uses a button with an aria-label or close icon
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(mockSetTriggerModal).toHaveBeenCalledWith(false);
  });
});

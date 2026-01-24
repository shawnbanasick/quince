import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmationModal from "../ConfirmationModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the external dependencies
vi.mock("react-responsive-modal", () => ({
  Modal: ({ open, onClose, children, className, center }) =>
    open ? (
      <div data-testid="modal" className={className} data-center={center}>
        <button onClick={onClose} data-testid="close-button">
          Close
        </button>
        {children}
      </div>
    ) : null,
}));

vi.mock("html-react-parser", () => ({
  default: (html) => html,
}));

vi.mock("../../../utilities/decodeHTML", () => ({
  default: (text) => text,
}));

vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

describe("ConfirmationModal", () => {
  const mockSetTriggerConfirmationFinishedModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    useSettingsStore.mockReturnValue({
      thinningConfirmModalHead: "<h1>Test Header</h1>",
      thinningConfirmModalText: "<p>Test content text</p>",
    });

    useStore.mockImplementation((selector) => {
      const mockState = {
        triggerConfirmationFinishedModal: false,
        setTriggerConfirmationFinishedModal: mockSetTriggerConfirmationFinishedModal,
      };
      return selector(mockState);
    });
  });

  it("should not render modal when triggerConfirmationFinishedModal is false", () => {
    render(<ConfirmationModal />);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("should render modal when triggerConfirmationFinishedModal is true", () => {
    useStore.mockImplementation((selector) => {
      const mockState = {
        triggerConfirmationFinishedModal: true,
        setTriggerConfirmationFinishedModal: mockSetTriggerConfirmationFinishedModal,
      };
      return selector(mockState);
    });

    render(<ConfirmationModal />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should display the correct header text", () => {
    useStore.mockImplementation((selector) => {
      const mockState = {
        triggerConfirmationFinishedModal: true,
        setTriggerConfirmationFinishedModal: mockSetTriggerConfirmationFinishedModal,
      };
      return selector(mockState);
    });

    render(<ConfirmationModal />);

    expect(screen.getByText("<h1>Test Header</h1>")).toBeInTheDocument();
  });

  it("should display the correct content text", () => {
    useStore.mockImplementation((selector) => {
      const mockState = {
        triggerConfirmationFinishedModal: true,
        setTriggerConfirmationFinishedModal: mockSetTriggerConfirmationFinishedModal,
      };
      return selector(mockState);
    });

    render(<ConfirmationModal />);

    expect(screen.getByText("<p>Test content text</p>")).toBeInTheDocument();
  });

  it("should call setTriggerConfirmationFinishedModal with false when modal is closed", async () => {
    useStore.mockImplementation((selector) => {
      const mockState = {
        triggerConfirmationFinishedModal: true,
        setTriggerConfirmationFinishedModal: mockSetTriggerConfirmationFinishedModal,
      };
      return selector(mockState);
    });

    const user = userEvent.setup();
    render(<ConfirmationModal />);

    const closeButton = screen.getByTestId("close-button");
    await user.click(closeButton);

    expect(mockSetTriggerConfirmationFinishedModal).toHaveBeenCalledWith(false);
    expect(mockSetTriggerConfirmationFinishedModal).toHaveBeenCalledTimes(1);
  });

  it("should handle empty langObj values gracefully", () => {
    useSettingsStore.mockReturnValue({
      thinningConfirmModalHead: "",
      thinningConfirmModalText: "",
    });

    useStore.mockImplementation((selector) => {
      const mockState = {
        triggerConfirmationFinishedModal: true,
        setTriggerConfirmationFinishedModal: mockSetTriggerConfirmationFinishedModal,
      };
      return selector(mockState);
    });

    render(<ConfirmationModal />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should apply customModal className to Modal", () => {
    useStore.mockImplementation((selector) => {
      const mockState = {
        triggerConfirmationFinishedModal: true,
        setTriggerConfirmationFinishedModal: mockSetTriggerConfirmationFinishedModal,
      };
      return selector(mockState);
    });

    render(<ConfirmationModal />);

    const modal = screen.getByTestId("modal");
    expect(modal).toHaveClass("customModal");
  });

  it("should center the modal", () => {
    useStore.mockImplementation((selector) => {
      const mockState = {
        triggerConfirmationFinishedModal: true,
        setTriggerConfirmationFinishedModal: mockSetTriggerConfirmationFinishedModal,
      };
      return selector(mockState);
    });

    render(<ConfirmationModal />);

    const modal = screen.getByTestId("modal");
    expect(modal).toHaveAttribute("data-center", "true");
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SubmitSuccessModal from "../SubmitSuccessModal";

// Mocking the stores to control the component state
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: (selector) =>
    selector({
      langObj: {
        transferOkModalHeader: "Success Header",
        transferOkModalText: "<p>Your transmission was successful.</p>",
      },
    }),
}));

// Mocking useStore with a set of default return values
const mockSetTriggerModal = vi.fn();
const mockSetDisplayGoodbye = vi.fn();

vi.mock("../../../globalState/useStore", () => ({
  default: (selector) => {
    const state = {
      triggerTransmissionOKModal: true, // Modal open by default for testing
      setTriggerTransmissionOKModal: mockSetTriggerModal,
      setDisplayGoodbyeMessage: mockSetDisplayGoodbye,
    };
    return selector(state);
  },
}));

// Mocking the utilities to return strings directly for easier assertions
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

// Mocking the modal library to simplify the DOM structure
vi.mock("react-responsive-modal", () => ({
  Modal: ({ children, open, onClose }) =>
    open ? (
      <div role="dialog">
        <button onClick={onClose} aria-label="close-button">
          Close
        </button>
        {children}
      </div>
    ) : null,
}));

describe("SubmitSuccessModal", () => {
  it("renders the modal with correct decoded content when open", () => {
    render(<SubmitSuccessModal />);

    expect(screen.getByText("Success Header")).toBeDefined();
    expect(screen.getByText("Your transmission was successful.")).toBeDefined();
  });

  it("calls the correct store actions when the modal is closed", () => {
    render(<SubmitSuccessModal />);

    const closeButton = screen.getByLabelText("close-button");
    fireEvent.click(closeButton);

    // Verify state updates
    expect(mockSetTriggerModal).toHaveBeenCalledWith(false);
    expect(mockSetDisplayGoodbye).toHaveBeenCalledWith(true);
  });
});

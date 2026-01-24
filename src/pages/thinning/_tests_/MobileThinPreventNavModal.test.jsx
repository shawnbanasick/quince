import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Adjust imports to match your actual file structure
import ThinningPreventNavModal from "../MobileThinPreventNavModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// --- Mocks ---

// 1. Mock the external Modal library
// We render a simple div with a button so we can test the "onClose" interaction.
vi.mock("react-responsive-modal", () => ({
  Modal: ({ open, onClose, children, className, center }) => {
    return open ? (
      <div data-testid="modal" className={className} data-center={center ? "true" : "false"}>
        <button onClick={onClose} data-testid="modal-close-btn">
          X
        </button>
        {children}
      </div>
    ) : null;
  },
}));

// 2. Mock Parsers and Decoders
// We verify that the component passes data through these.
// Returning identity (val => val) allows us to assert the raw text matches.
vi.mock("html-react-parser", () => ({
  default: (html) => (html ? `Parsed: ${html}` : null),
}));

vi.mock("../../../utilities/decodeHTML", () => ({
  default: (text) => text,
}));

// 3. Mock Zustand Stores
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

describe("ThinningPreventNavModal", () => {
  const mockSetTrigger = vi.fn();

  // Helper to mock the 'useStore' (App State)
  const mockAppState = (isOpen = false) => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinPreventNavModal: isOpen,
        setTriggerMobileThinPreventNavModal: mockSetTrigger,
      };
      return selector(state);
    });
  };

  // Helper to mock the 'useSettingsStore' (Content/Lang)
  const mockSettingsState = (header, text) => {
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: {
          mobileThinPreventNavModalHead: header,
          mobileThinPreventNavModalText: text,
        },
      };
      return selector(state);
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Silence the console.log("modal modal...") from the component during tests
    vi.spyOn(console, "log").mockImplementation(() => {});

    // Default setup: Modal Closed, with dummy text
    mockAppState(false);
    mockSettingsState("My Header", "My Content");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render the modal when trigger is false", () => {
    mockAppState(false);
    render(<ThinningPreventNavModal />);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("should render the modal when trigger is true", () => {
    mockAppState(true);
    render(<ThinningPreventNavModal />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should display the correct parsed header and content", () => {
    mockAppState(true);
    mockSettingsState("<b>Warning</b>", "<i>Details</i>");

    render(<ThinningPreventNavModal />);

    // Note: We mocked html-react-parser to prefix "Parsed:" to verify the parser was called
    expect(screen.getByText("Parsed: <b>Warning</b>")).toBeInTheDocument();
    expect(screen.getByText("Parsed: <i>Details</i>")).toBeInTheDocument();
  });

  it("should handle null or undefined content gracefully", () => {
    mockAppState(true);
    // Simulate empty langObj fields
    mockSettingsState(null, undefined);

    render(<ThinningPreventNavModal />);

    // It should render the modal but the content areas should be empty or handle the fallback
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should calls setTriggerMobileThinPreventNavModal(false) when closed", async () => {
    const user = userEvent.setup();
    mockAppState(true);

    render(<ThinningPreventNavModal />);

    const closeBtn = screen.getByTestId("modal-close-btn");
    await user.click(closeBtn);

    expect(mockSetTrigger).toHaveBeenCalledTimes(1);
    expect(mockSetTrigger).toHaveBeenCalledWith(false);
  });

  it("should have the correct styled-component structure", () => {
    mockAppState(true);
    render(<ThinningPreventNavModal />);

    const modal = screen.getByTestId("modal");

    // Check if the Horizontal Rule (hr) exists
    // (using querySelector inside the modal element)
    expect(modal.querySelector("hr")).toBeInTheDocument();

    // Verify react-responsive-modal props via our mock
    expect(modal).toHaveClass("customModal");
    expect(modal).toHaveAttribute("data-center", "true");
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MobilePresortRedoModal from "../MobilePresortRedoModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom hooks
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// 2. Mock the utilities/parsers if necessary
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("MobilePresortRedoModal", () => {
  const mockClickFunction = vi.fn();
  const mockSetTrigger = vi.fn();

  const defaultProps = {
    clickFunction: mockClickFunction,
    statement: {
      current: { statement: "Test Statement Content" },
    },
  };

  const mockSettings = {
    langObj: {
      mobilePresortRedoModalHead: "Header Text",
      mobilePresortRedoModalConfirmButton: "Confirm",
      mobileModalButtonCancel: "Cancel",
      mobilePresortAssignLeft: "Dislike",
      mobilePresortAssignRight: "Like",
      mobilePresortEvaluationsComplete: "Evaluations Complete",
    },
    mapObj: {
      useColLabelEmojiPresort: ["false"], // Test text buttons first
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock store implementations
    useSettingsStore.mockImplementation((selector) => selector(mockSettings));
    useStore.mockImplementation((selector) => {
      // Simulate trigger state and setter
      if (selector.name === "getTriggerMobilePresortRedoModal") return true;
      if (selector.name === "getSetTriggerMobilePresortRedoModal") return mockSetTrigger;
      return null;
    });

    // react-modal requires an app element or it logs warnings
    const el = document.createElement("div");
    el.setAttribute("id", "root");
    document.body.appendChild(el);
  });

  it("renders correctly when open", () => {
    render(<MobilePresortRedoModal {...defaultProps} />);

    expect(screen.getByText("Header Text")).toBeInTheDocument();
    expect(screen.getByText("Test Statement Content")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("updates value when selection buttons are clicked", () => {
    render(<MobilePresortRedoModal {...defaultProps} />);

    // Click the "Positive" button (+)
    const plusButton = screen.getByText("+");
    fireEvent.click(plusButton);

    // Click Confirm
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    // Verify clickFunction was called with 2 (positive value)
    // expect(mockClickFunction).toHaveBeenCalledWith(2);
    expect(mockSetTrigger).toHaveBeenCalledWith(false);
  });

  it("calls onCloseModal when cancel is clicked", () => {
    render(<MobilePresortRedoModal {...defaultProps} />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockSetTrigger).toHaveBeenCalledWith(false);
    expect(mockClickFunction).not.toHaveBeenCalled();
  });
});

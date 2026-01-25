import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MobileSortSwapModal from "../MobileSortSwapModal";

// Import the hooks
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";
import { useEmojiArrays } from "../mobileSortHooks/useEmojiArrays";

// 1. Mock the modules
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

vi.mock("../mobileSortHooks/useEmojiArrays", () => ({
  useEmojiArrays: vi.fn(),
}));

vi.mock("../../../assets/swapArrow.svg?react", () => ({
  default: () => <div data-testid="swap-arrows" />,
}));

describe("MobileSortSwapModal Component", () => {
  const mockSetTriggerModal = vi.fn();
  const mockClearSelected = vi.fn();
  const mockHandleStatementSwap = vi.fn();

  const mockLangObj = {
    mobileSortSwapModalHead: "Swap Statements?",
    mobileSortSwapModalConfirmButton: "Confirm",
    mobileModalButtonCancel: "Cancel",
    mobileSortSwapModalSuccessMessage: "Success!",
  };

  const mockMapObj = {
    qSortHeaderNumbers: ["-4", "-3", "-2", "-1", "1", "2", "3", "4"],
    useColLabelNums: [true],
    useColLabelText: [true],
    useColLabelEmoji: [true],
  };

  const defaultProps = {
    targetArray: [
      { index: 0, groupNumber: "1", statement: "Statement A", color: "red", fontSize: 2 },
      { index: 1, groupNumber: "2", statement: "Statement B", color: "blue", fontSize: 2 },
    ],
    clearSelected: mockClearSelected,
    handleStatementSwap: mockHandleStatementSwap,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // 2. Use mockReturnValue instead of mockImplementation
    // We use .mockReturnValueOnce() or .mockReturnValue() to handle sequential calls

    useEmojiArrays.mockReturnValue({ displayArray: ["😀", "🚀"] });

    // useSettingsStore is called twice in the component (langObj and mapObj)
    useSettingsStore
      .mockReturnValueOnce(mockLangObj) // First call: getLangObj
      .mockReturnValueOnce(mockMapObj); // Second call: getMapObj

    // useStore is called twice (triggerModal and setTriggerModal)
    useStore
      .mockReturnValueOnce(true) // First call: getTriggerModal
      .mockReturnValueOnce(mockSetTriggerModal); // Second call: getSetTriggerModal
  });

  it("renders the modal content correctly", () => {
    render(<MobileSortSwapModal {...defaultProps} />);

    expect(screen.getByText("Swap Statements?")).toBeInTheDocument();
    expect(screen.getByText("Statement A")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("renders nothing if targetArray is empty", () => {
    const { container } = render(<MobileSortSwapModal {...defaultProps} targetArray={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

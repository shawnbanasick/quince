import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MobileSortHelpModal from "../MobileThinScrollBottomModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the HTML utility (optional, but keeps things clean)
vi.mock("../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("MobileSortHelpModal", () => {
  const mockSetTriggerModal = vi.fn();

  const mockLangObj = {
    mobileThinScrollBottomModalHead: "Test Header",
    mobileThinScrollBottomModalText: "<p>Test Content</p>",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default store behavior: Modal is OPEN
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinScrollBottomModal: true,
        setTriggerMobileThinScrollBottomModal: mockSetTriggerModal,
      };
      return selector(state);
    });
  });

  it("renders the modal with correct content when trigger is true", () => {
    render(<MobileSortHelpModal />);

    expect(screen.getByText("Test Header")).toBeDefined();
    expect(screen.getByText("Test Content")).toBeDefined();
  });

  it("does not render content when trigger is false", () => {
    // Override store for this specific test
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileThinScrollBottomModal: false,
        setTriggerMobileThinScrollBottomModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<MobileSortHelpModal />);

    // react-responsive-modal usually removes content from DOM when closed
    expect(screen.queryByText("Test Header")).toBeNull();
  });
});

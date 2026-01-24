import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ThinHelpModal from "../ThinHelpModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the custom stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the utilities to return simple strings for easier testing
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("ThinHelpModal Component", () => {
  const mockSetTriggerSortModal = vi.fn();

  const mockLangObj = {
    thinningHelpModalHead: "Test Header Content",
    thinningHelpModalText: "Test Body Content",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useSettingsStore implementation for langObj
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));

    // Mock useStore implementation for modal state and setter
    useStore.mockImplementation((selector) => {
      const state = {
        triggerThinHelpModal: true, // Default to open for most tests
        setTriggerThinHelpModal: mockSetTriggerSortModal,
      };
      return selector(state);
    });
  });

  it("renders the modal with correct content when open", () => {
    render(<ThinHelpModal />);

    expect(screen.getByText("Test Header Content")).toBeInTheDocument();
    expect(screen.getByText("Test Body Content")).toBeInTheDocument();
  });

  it("does not render content when triggerThinHelpModal is false", () => {
    // Override store mock for this specific test
    useStore.mockImplementation((selector) => {
      const state = {
        triggerThinHelpModal: false,
        setTriggerThinHelpModal: mockSetTriggerSortModal,
      };
      return selector(state);
    });

    render(<ThinHelpModal />);

    expect(screen.queryByText("Test Header Content")).not.toBeInTheDocument();
  });
});

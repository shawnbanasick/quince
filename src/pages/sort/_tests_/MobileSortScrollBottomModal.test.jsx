import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MobileSortHelpModal from "../MobileSortScrollBottomModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the external stores
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// 2. Mock the utility (optional, but ensures clean output)
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("MobileSortHelpModal", () => {
  const mockSetTriggerModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for useSettingsStore (Language Data)
    useSettingsStore.mockImplementation((selector) =>
      selector({
        langObj: {
          mobileSortScrollBottomModalHead: "Test Header",
          mobileSortScrollBottomModalText: "<p>Test Body Content</p>",
        },
      }),
    );
  });

  it("should not render the modal when triggerModal is false", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileSortScrollBottomModal: false,
        setTriggerMobileSortScrollBottomModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<MobileSortHelpModal />);

    // react-responsive-modal removes content from DOM when closed
    expect(screen.queryByText("Test Header")).not.toBeInTheDocument();
  });

  it("should render correctly when triggerModal is true", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileSortScrollBottomModal: true,
        setTriggerMobileSortScrollBottomModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<MobileSortHelpModal />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Body Content")).toBeInTheDocument();
  });
});

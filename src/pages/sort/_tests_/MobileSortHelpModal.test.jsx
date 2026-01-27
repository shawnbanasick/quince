import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MobileSortHelpModal from "../MobileSortHelpModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the external stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the HTML decoder utility
vi.mock("../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("MobileSortHelpModal", () => {
  const mockSetTriggerModal = vi.fn();

  const mockLangObj = {
    mobileSortHelpModalHead: "Test Header",
    mobileSortHelpModalText: "<p>Test Content</p>",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default implementation for store mocks
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));
  });

  it("should not render the modal when triggerModal is false", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileSortHelpModal: false,
        setTriggerMobileSortHelpModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<MobileSortHelpModal />);

    // react-responsive-modal removes content from DOM when closed
    const header = screen.queryByText("Test Header");
    expect(header).not.toBeInTheDocument();
  });

  it("should render the header and parsed HTML content when triggerModal is true", () => {
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileSortHelpModal: true,
        setTriggerMobileSortHelpModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<MobileSortHelpModal />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});

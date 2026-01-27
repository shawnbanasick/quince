import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MobileSurveyHelpModal from "../MobileSurveyHelpModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the stores
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// Mock the HTML decoder utility to return strings as-is
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("MobileSurveyHelpModal", () => {
  const mockSetTriggerModal = vi.fn();

  const mockLangObj = {
    mobileSurveyHelpModalHead: "Test Header",
    mobileSurveyHelpModalText: "Test Content Body",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for useSettingsStore (Language)
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));

    // Default mock implementation for useStore (Modal state)
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileSurveyHelpModal: true,
        setTriggerMobileSurveyHelpModal: mockSetTriggerModal,
      };
      return selector(state);
    });
  });

  it("renders the modal with correct header and content when open", () => {
    render(<MobileSurveyHelpModal />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Content Body")).toBeInTheDocument();
  });

  it("does not render the modal content when triggerMobileSurveyHelpModal is false", () => {
    // Override the mock for this specific test
    useStore.mockImplementation((selector) => {
      const state = {
        triggerMobileSurveyHelpModal: false,
        setTriggerMobileSurveyHelpModal: mockSetTriggerModal,
      };
      return selector(state);
    });

    render(<MobileSurveyHelpModal />);

    // react-responsive-modal removes content from DOM when closed
    expect(screen.queryByText("Test Header")).not.toBeInTheDocument();
  });
});

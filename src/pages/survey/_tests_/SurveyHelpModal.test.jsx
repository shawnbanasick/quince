import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SurveyHelpModal from "../SurveyHelpModal";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// 1. Mock the stores
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

describe("SurveyHelpModal", () => {
  const mockSetTriggerSurveyModal = vi.fn();

  const mockLangObj = {
    surveyModalHead: "Test Heading",
    surveyModalText: "<p>Test Content</p>",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for useSettingsStore (Language)
    useSettingsStore.mockImplementation((selector) => selector({ langObj: mockLangObj }));

    // Default mock implementation for useStore (UI State)
    useStore.mockImplementation((selector) => {
      const state = {
        triggerSurveyModal: true,
        setTriggerSurveyModal: mockSetTriggerSurveyModal,
      };
      return selector(state);
    });
  });

  it("renders the modal with correct content when triggerSurveyModal is true", () => {
    render(<SurveyHelpModal />);

    expect(screen.getByText("Test Heading")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("does not render the modal content when triggerSurveyModal is false", () => {
    // Override store mock for this specific test
    useStore.mockImplementation((selector) => {
      const state = {
        triggerSurveyModal: false,
        setTriggerSurveyModal: mockSetTriggerSurveyModal,
      };
      return selector(state);
    });

    render(<SurveyHelpModal />);

    expect(screen.queryByText("Test Heading")).not.toBeInTheDocument();
  });
});

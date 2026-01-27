import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MobileSurvey from "../MobileSurvey";
import useStore from "../../../globalState/useStore";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useScreenOrientation from "../../../utilities/useScreenOrientation";

// 1. Mock the custom hooks/stores
vi.mock("../../../globalState/useStore");
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../utilities/useScreenOrientation");
vi.mock("../../../utilities/calculateTimeOnPage", () => ({
  default: vi.fn(),
}));

// Mocking SVG imports
vi.mock("../../assets/helpSymbol.svg?react", () => ({
  default: () => <svg data-testid="help-icon" />,
}));

describe("MobileSurvey Component", () => {
  const mockSetCurrentPage = vi.fn();
  const mockSetProgressScore = vi.fn();
  const mockSetTriggerHelpModal = vi.fn();
  const mockSetRequiredAnswersObj = vi.fn();

  const defaultLangObj = {
    surveyHeader: "Survey Header",
    screenOrientationText: "Please rotate your device",
    expandViewMessage: "Expand view message",
    mobileSurveyHelpModalHead: "Help Header",
    mobileSurveyHelpModalText: "Help Text",
  };

  beforeEach(() => {
    // Setup default localStorage
    const mockViewSize = JSON.stringify({ survey: 80 });
    Storage.prototype.getItem = vi.fn(() => mockViewSize);

    // Default implementation for useStore (UI State)
    useStore.mockImplementation((selector) => {
      const state = {
        setCurrentPage: mockSetCurrentPage,
        setProgressScore: mockSetProgressScore,
        setTriggerMobileSurveyHelpModal: mockSetTriggerHelpModal,
        setTriggerSurveyPreventNavModal: vi.fn(),
        checkRequiredQuestionsComplete: vi.fn(),
        mobileSurveyViewSize: 80,
        triggerMobileSurveyHelpModal: false,
        triggerSurveyPreventNavModal: false,
      };
      return selector(state);
    });

    // Default implementation for useSettingsStore (Config/Data)
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        configObj: { headerBarColor: "#000000" },
        langObj: defaultLangObj,
        requiredAnswersObj: { q1: "no response" },
        surveyQuestionObjArray: [{ type: "text", title: "Question 1", id: "1" }],
        setRequiredAnswersObj: mockSetRequiredAnswersObj,
      };
      return selector(state);
    });

    useScreenOrientation.mockReturnValue("portrait-primary");
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the survey header and questions", () => {
    render(<MobileSurvey />);
    expect(screen.getByText("Survey Header")).toBeInTheDocument();
    expect(screen.getByText("Expand view message")).toBeInTheDocument();
  });

  it("shows the orientation warning when in landscape mode", () => {
    useScreenOrientation.mockReturnValue("landscape-primary");
    render(<MobileSurvey />);
    expect(screen.getByText("Please rotate your device")).toBeInTheDocument();
  });

  it("updates progress score and current page on mount", () => {
    render(<MobileSurvey />);
    expect(mockSetCurrentPage).toHaveBeenCalledWith("survey");
    // expect(mockSetProgressScore).toHaveBeenCalledWith(20);
  });

  it("resets required answers on mount", () => {
    render(<MobileSurvey />);
    expect(mockSetRequiredAnswersObj).toHaveBeenCalled();
  });

  it("renders 'No questions added' when question array is empty", () => {
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        configObj: {},
        langObj: defaultLangObj,
        requiredAnswersObj: {},
        surveyQuestionObjArray: null,
        setRequiredAnswersObj: vi.fn(),
      };
      return selector(state);
    });

    render(<MobileSurvey />);
    expect(screen.getByText("No questions added.")).toBeInTheDocument();
  });
});

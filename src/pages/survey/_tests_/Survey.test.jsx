import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import SurveyPage from "../Survey";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";
import calculateTimeOnPage from "../../../utilities/calculateTimeOnPage";
import { MemoryRouter } from "react-router-dom";

// 1. Mock the custom hooks
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// 2. Mock utilities
vi.mock("../../../utilities/calculateTimeOnPage");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((str) => str),
}));

// 3. Mock sub-components to keep the test focused (and avoid deep nesting errors)
vi.mock("../SurveyTextElement", () => ({ default: () => <div data-testid="text-element" /> }));
vi.mock("../SurveyRadioElement", () => ({ default: () => <div data-testid="radio-element" /> }));
vi.mock("../SurveyHelpModal", () => ({ default: () => <div data-testid="help-modal" /> }));

describe("SurveyPage Component", () => {
  const mockSetCurrentPage = vi.fn();
  const mockSetDisplayNextButton = vi.fn();
  const mockSetRequiredAnswersObj = vi.fn();

  const defaultSettings = {
    configObj: { headerBarColor: "#000" },
    langObj: {
      surveyHeader: "Test Survey",
      surveyPreventNavModalHead: "nav modal head",
      surveyPreventNavModalText: "nav modal body",
      surveyPreventNavModalBtn1: "nav modal btn1",
      surveyPreventNavModalBtn2: "nav modal btn2",
    },
    requiredAnswersObj: { q1: "no response" },
    surveyQuestionObjArray: [
      { type: "text", id: "1" },
      { type: "radio", id: "2" },
    ],
    setRequiredAnswersObj: mockSetRequiredAnswersObj,
  };

  beforeEach(() => {
    // Setup hook returns
    useSettingsStore.mockImplementation((selector) => selector(defaultSettings));
    useStore.mockImplementation((selector) => {
      const store = {
        setCurrentPage: mockSetCurrentPage,
        checkRequiredQuestionsComplete: vi.fn(),
        setDisplayNextButton: mockSetDisplayNextButton,
      };
      return selector(store);
    });

    // Mock localStorage
    vi.spyOn(Storage.prototype, "setItem");
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the header with correctly decoded text", () => {
    render(
      <MemoryRouter>
        <SurveyPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Test Survey")).toBeDefined();
  });

  it("renders 'No questions added' when the question array is empty", () => {
    useSettingsStore.mockImplementation((selector) =>
      selector({ ...defaultSettings, surveyQuestionObjArray: null }),
    );
    render(
      <MemoryRouter>
        <SurveyPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/No questions added/i)).toBeDefined();
  });

  it("renders the correct component types based on question objects", () => {
    render(
      <MemoryRouter>
        <SurveyPage />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("text-element")).toBeDefined();
    expect(screen.getByTestId("radio-element")).toBeDefined();
  });

  it("calculates time on page when unmounting", () => {
    const { unmount } = render(
      <MemoryRouter>
        <SurveyPage />
      </MemoryRouter>,
    );
    unmount();
    expect(calculateTimeOnPage).toHaveBeenCalled();
  });

  it("resets required answers in the store on mount", () => {
    render(
      <MemoryRouter>
        <SurveyPage />
      </MemoryRouter>,
    );
    expect(mockSetRequiredAnswersObj).toHaveBeenCalled();
    // Verify it passes an object where values are reset to "no response"
    const calledWith = mockSetRequiredAnswersObj.mock.calls[0][0];
    expect(calledWith.q1).toBe("no response");
  });
});

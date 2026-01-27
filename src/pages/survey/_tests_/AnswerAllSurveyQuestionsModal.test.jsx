import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AnswerAllSurveyQuestionsModal from "../AnswerAllSurveyQuestionsModal";

// Define a mock setter function to track calls
const setTriggerMock = vi.fn();

// 1. Mock useSettingsStore
vi.mock("../../../globalState/useSettingsStore", () => {
  return {
    default: (selector) =>
      selector({
        langObj: {
          surveyPreventNavModalHead: "Survey Header",
          surveyPreventNavModalText: "Please answer all questions.",
        },
      }),
  };
});

// 2. Mock useStore
vi.mock("../../../globalState/useStore", () => {
  return {
    default: (selector) =>
      selector({
        triggerSurveyPreventNavModal: true,
        setTriggerSurveyPreventNavModal: setTriggerMock,
      }),
  };
});

// 3. Mock the Modal component to avoid Portal/DOM issues in JSDOM
vi.mock("react-responsive-modal", () => {
  return {
    Modal: ({ children, open, onClose }) => {
      if (!open) return null;
      return (
        <div role="dialog">
          <button aria-label="close" onClick={onClose}>
            X
          </button>
          {children}
        </div>
      );
    },
  };
});

describe("AnswerAllSurveyQuestionsModal", () => {
  it("displays the correct header and content from the settings store", () => {
    render(<AnswerAllSurveyQuestionsModal />);

    // Check for the header text
    expect(screen.getByText("Survey Header")).toBeInTheDocument();

    // Check for the body text
    expect(screen.getByText("Please answer all questions.")).toBeInTheDocument();
  });

  it("calls the setter function with false when the close button is triggered", () => {
    render(<AnswerAllSurveyQuestionsModal />);

    // Find the close button we created in our mock
    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    // Assert that the store's setter was called correctly
    expect(setTriggerMock).toHaveBeenCalledWith(false);
  });

  it("renders a horizontal rule between header and content", () => {
    render(<AnswerAllSurveyQuestionsModal />);

    const hrElement = screen.getByRole("separator");
    expect(hrElement).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SurveyTextElement from "../SurveyTextElement";

// Mock the external utilities
vi.mock("../../utilities/decodeHTML", () => ({ default: (str) => str }));
vi.mock("../../utilities/sanitizeString", () => ({ default: (str) => str }));
vi.mock("../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initialValue) => {
    let value = initialValue;
    const setValue = vi.fn((newValue) => {
      value = newValue;
    });
    return [value, setValue];
  }),
}));

describe("SurveyTextElement", () => {
  const defaultProps = {
    opts: {
      itemNum: 1,
      label: "What is your name?",
      placeholder: "Enter name",
      note: "Please be honest",
      required: false,
      restricted: false,
      limited: false,
    },
    check: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Component expects resultsSurvey to exist in localStorage
    localStorage.setItem("resultsSurvey", JSON.stringify({}));
  });

  it("renders the label and placeholder correctly", () => {
    render(<SurveyTextElement {...defaultProps} />);

    expect(screen.getByText("What is your name?")).toBeDefined();
    expect(screen.getByPlaceholderText("Enter name")).toBeDefined();
  });

  it("toggles the note section based on presence of note text", () => {
    const { rerender } = render(<SurveyTextElement {...defaultProps} />);
    expect(screen.getByText("Please be honest")).toBeDefined();

    const noNoteProps = {
      ...defaultProps,
      opts: { ...defaultProps.opts, note: "" },
    };
    rerender(<SurveyTextElement {...noNoteProps} />);
    expect(screen.queryByText("Please be honest")).toBeNull();
  });

  it("applies error styling when a required field is empty and check is triggered", () => {
    const requiredProps = {
      ...defaultProps,
      opts: { ...defaultProps.opts, required: true },
      check: true,
    };

    // We render a component where userText (mocked) is ""
    const { container } = render(<SurveyTextElement {...requiredProps} />);

    // The first child of the component is the styled Container
    const styledContainer = container.firstChild;

    // Check for the specific error styles defined in your useEffect
    expect(styledContainer).toHaveStyle({
      "background-color": "rgba(253, 224, 71, .5)",
      outline: "3px dashed black",
    });
  });
});

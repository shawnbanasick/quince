import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SurveyTextAreaElement from "../SurveyTextAreaElement";

// 1. Mock the utilities
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((str) => str),
}));
vi.mock("../../../utilities/sanitizeString.js", () => ({
  default: vi.fn((str) => `sanitized-${str}`),
}));
vi.mock("../../../utilities/useLocalStorage.js", () => ({
  // Mocking the hook to return a state and a setter
  default: vi.fn((key, initial) => {
    let val = initial;
    const setVal = vi.fn((newVal) => {
      val = newVal;
    });
    return [val, setVal];
  }),
}));

// 2. Mock html-react-parser
vi.mock("html-react-parser", () => ({
  default: vi.fn((html) => html),
}));

describe("SurveyTextAreaElement", () => {
  const defaultProps = {
    opts: {
      itemNum: 1,
      label: "Test Label",
      note: "Test Note",
      placeholder: "Test Placeholder",
      required: false,
    },
    check: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup a fake localStorage
    const storage = { resultsSurvey: JSON.stringify({}) };
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key) => storage[key] || null),
      setItem: vi.fn((key, value) => {
        storage[key] = value;
      }),
    });
  });

  it("renders the label and placeholder correctly", () => {
    render(<SurveyTextAreaElement {...defaultProps} />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Test Placeholder")).toBeInTheDocument();
  });

  it("toggles the note display based on prop content", () => {
    const { rerender } = render(<SurveyTextAreaElement {...defaultProps} />);
    expect(screen.getByText("Test Note")).toBeInTheDocument();

    const noNoteProps = {
      ...defaultProps,
      opts: { ...defaultProps.opts, note: "" },
    };
    rerender(<SurveyTextAreaElement {...noNoteProps} />);
    expect(screen.queryByText("Test Note")).not.toBeInTheDocument();
  });

  it("applies error styling when a required field is empty and check is triggered", () => {
    const requiredProps = {
      ...defaultProps,
      opts: { ...defaultProps.opts, required: true },
      check: true, // This triggers the useEffect logic
    };

    const { container } = render(<SurveyTextAreaElement {...requiredProps} />);

    // The Container is the first child of the render
    const styledContainer = container.firstChild;

    // Check for the specific error background color defined in your component
    expect(styledContainer).toHaveStyle("background-color: rgba(253, 224, 71, .5)");
    expect(styledContainer).toHaveStyle("outline: 3px dashed black");
  });
});

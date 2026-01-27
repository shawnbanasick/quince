import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SurveyDropdownElement from "../SurveyDropdownElement";

// 1. Mock the custom hook
vi.mock("../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initialValue) => [initialValue, vi.fn()]),
}));

// 2. Mock external utilities if they rely on DOM features not in JSDOM
vi.mock("../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("SurveyDropdownElement", () => {
  const defaultProps = {
    check: false,
    opts: {
      id: "q1",
      itemNum: "1",
      label: "What is your favorite fruit?",
      options: "Apple;;;Banana;;;Cherry",
      note: "Please select at least one",
      required: true,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders the question label and note text correctly", () => {
    render(<SurveyDropdownElement {...defaultProps} />);

    expect(screen.getByText("What is your favorite fruit?")).toBeDefined();
    expect(screen.getByText("Please select at least one")).toBeDefined();
  });

  it("does not render the note container if note is empty", () => {
    const propsNoNote = {
      ...defaultProps,
      opts: { ...defaultProps.opts, note: "" },
    };
    const { container } = render(<SurveyDropdownElement {...propsNoNote} />);

    // Check for the styled-component ID or the absence of text
    const note = container.querySelector("#noteText");
    expect(note).toBeNull();
  });

  it("highlights the container when a required question is empty and check is triggered", () => {
    const propsRequired = {
      ...defaultProps,
      check: true, // Trigger validation
      opts: { ...defaultProps.opts, required: true },
    };

    const { container } = render(<SurveyDropdownElement {...propsRequired} />);

    // Container is the first div child of our render
    const styledContainer = container.firstChild;

    // Check for the specific styles defined in your useEffect
    expect(styledContainer).toHaveStyle({
      "background-color": "rgba(253, 224, 71, .5)",
      outline: "3px dashed black",
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import SurveyRatings10Element from "../SurveyRating10Element";

// 1. Mock useLocalStorage hook
vi.mock("../../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initialValue) => {
    const [state, setState] = React.useState(initialValue);
    return [state, setState];
  }),
}));

// 2. Mock uuid to keep snapshots/IDs consistent
vi.mock("uuid", () => ({
  v4: () => "mocked-uuid",
}));

describe("SurveyRatings10Element", () => {
  const defaultProps = {
    opts: {
      itemNum: 1,
      options: "Option A;;;Option B",
      label: "Main Question Label",
      note: "Please read this note",
      required: true,
    },
    check: false,
  };

  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    // Component expects resultsSurvey to exist in localStorage
    localStorage.setItem("resultsSurvey", JSON.stringify({}));
    vi.clearAllMocks();
  });

  it("renders the label and note text correctly", () => {
    render(<SurveyRatings10Element {...defaultProps} />);

    expect(screen.getByText("Main Question Label")).toBeInTheDocument();
    expect(screen.getByText("Please read this note")).toBeInTheDocument();
  });

  it("renders the correct number of rows based on options prop", () => {
    render(<SurveyRatings10Element {...defaultProps} />);

    // Two options provided: Option A and Option B
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();

    // Each row has 10 radio buttons, total 20
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(20);
  });

  it("hides the note section if note prop is empty", () => {
    const noNoteProps = {
      ...defaultProps,
      opts: { ...defaultProps.opts, note: "" },
    };
    render(<SurveyRatings10Element {...noNoteProps} />);

    const noteElement = document.getElementById("noteText");
    expect(noteElement).toBeNull();
  });
});

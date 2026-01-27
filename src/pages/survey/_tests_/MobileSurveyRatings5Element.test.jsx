import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SurveyRatings5Element from "../MobileSurveyRating5Element";

// 1. Mock the custom hook
vi.mock("../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initialValue) => [initialValue, vi.fn()]),
}));

// 2. Mock decodeHTML utility
vi.mock("../../utilities/decodeHTML", () => ({
  default: vi.fn((str) => str),
}));

describe("SurveyRatings5Element", () => {
  const defaultProps = {
    opts: {
      itemNum: 1,
      options: "Option A;;;Option B;;;Option C",
      label: "Test Survey Label",
      note: "Please fill this out",
      required: true,
    },
    check: false,
  };

  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    localStorage.setItem("resultsSurvey", JSON.stringify({}));
    vi.clearAllMocks();
  });

  it("renders the label and note correctly", () => {
    render(<SurveyRatings5Element {...defaultProps} />);

    expect(screen.getByText("Test Survey Label")).toBeInTheDocument();
    expect(screen.getByText("Please fill this out")).toBeInTheDocument();
  });

  it("renders the correct number of rows based on options string", () => {
    render(<SurveyRatings5Element {...defaultProps} />);

    // 3 options = 3 rows. Each row has 5 radio inputs = 15 total inputs
    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(15);

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  it("removes highlighting when all options are answered", async () => {
    // We need to simulate the state where all 3 rows are checked
    // This is tricky because checked5State is internal.
    // We simulate user interaction:
    render(<SurveyRatings5Element {...defaultProps} check={true} />);

    const radios = screen.getAllByRole("radio");
    // Click 1st radio of row 1, 1st of row 2, 1st of row 3
    fireEvent.click(radios[0]);
    fireEvent.click(radios[5]);
    fireEvent.click(radios[10]);

    const mainContainer = screen.getByText("Test Survey Label").closest("div").parentElement;

    // Should revert to whitesmoke
    expect(mainContainer).toHaveStyle({
      "background-color": "rgb(211, 211, 211)",
    });
  });

  it("does not display NoteText if note is empty", () => {
    const noNoteProps = {
      ...defaultProps,
      opts: { ...defaultProps.opts, note: "" },
    };

    render(<SurveyRatings5Element {...noNoteProps} />);
    const noteElement = document.getElementById("noteText");
    expect(noteElement).toBeNull();
  });
});

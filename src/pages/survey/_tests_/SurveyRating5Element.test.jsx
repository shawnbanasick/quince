import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SurveyRatings5Element from "../SurveyRating5Element";

// 1. Mock the custom hooks and utilities
vi.mock("../../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initialValue) => [initialValue, vi.fn()]),
}));

// Mock ReactHtmlParser and decodeHTML to return strings directly for simplicity
vi.mock("../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));

describe("SurveyRatings5Element", () => {
  const defaultProps = {
    opts: {
      itemNum: 1,
      options: "Option A;;;Option B",
      label: "Test Survey Label",
      note: "Please fill this out",
      required: true,
    },
    check: false,
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    // Mock LocalStorage
    const localStorageMock = (() => {
      let store = {
        resultsSurvey: JSON.stringify({}),
      };
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
          store[key] = value.toString();
        },
        clear: () => {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
  });

  it("renders the label and note correctly", () => {
    render(<SurveyRatings5Element {...defaultProps} />);

    expect(screen.getByText("Test Survey Label")).toBeInTheDocument();
    expect(screen.getByText("Please fill this out")).toBeInTheDocument();
  });

  it("renders the correct number of rows based on options", () => {
    render(<SurveyRatings5Element {...defaultProps} />);

    // Each row has 5 radio buttons. 2 options = 10 radio buttons.
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(10);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("displays validation styling (yellow/dashed) when required and check is true", () => {
    const { container } = render(<SurveyRatings5Element {...defaultProps} check={true} />);

    // The Container is the first child of the render result
    const surveyContainer = container.firstChild;

    // When required but unanswered, it should have the specific background color
    expect(surveyContainer).toHaveStyle({
      "background-color": "rgba(253, 224, 71, .5)",
      outline: "3px dashed black",
    });
  });

  it("hides note section if note prop is empty", () => {
    const propsNoNote = {
      ...defaultProps,
      opts: { ...defaultProps.opts, note: "" },
    };

    render(<SurveyRatings5Element {...propsNoNote} />);
    const noteElement = document.getElementById("noteText");
    expect(noteElement).toBeNull();
  });
});

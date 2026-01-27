import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SurveyRatings2Element from "../MobileSurveyRating2Element";

// 1. Mock the custom hook
const mockSetCheckedState = vi.fn();
vi.mock("../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initialValue) => [initialValue, mockSetCheckedState]),
}));

// 2. Mock utilities
vi.mock("../../utilities/decodeHTML", () => ({
  default: (val) => val,
}));

describe("SurveyRatings2Element", () => {
  const defaultProps = {
    opts: {
      itemNum: 1,
      label: "Main Question Label",
      note: "Important Note",
      options: "Option 1;;;Option 2",
      scale: "Low;;;High",
      required: true,
    },
    check: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    // Setup a mock localStorage for the handleChange logic
    const store = { resultsSurvey: JSON.stringify({}) };
    vi.stubGlobal("localStorage", {
      getItem: (key) => store[key],
      setItem: (key, value) => {
        store[key] = value;
      },
    });
  });

  it("renders the question label and scale headers correctly", () => {
    render(<SurveyRatings2Element {...defaultProps} />);

    expect(screen.getByText("Main Question Label")).toBeDefined();
    expect(screen.getByText("Low")).toBeDefined();
    expect(screen.getByText("High")).toBeDefined();
    expect(screen.getByText("Option 1")).toBeDefined();
    expect(screen.getByText("Option 2")).toBeDefined();
  });

  it("displays note text when provided", () => {
    render(<SurveyRatings2Element {...defaultProps} />);
    expect(screen.getByText("Important Note")).toBeDefined();
  });

  it("highlights the component in yellow if required and 'check' prop is true", () => {
    const propsWithCheck = { ...defaultProps, check: true };

    // We need to ensure the logic 'objTestValue < arrayLen' is met (nothing checked)
    const { container } = render(<SurveyRatings2Element {...propsWithCheck} />);

    // The Container is the first child of the rendered output
    const styledContainer = container.firstChild;

    // Check for the yellow background color defined in your useEffect
    // Note: styled-components colors are often converted to RGB in the DOM
    expect(styledContainer).toHaveStyle({
      backgroundColor: "rgba(253, 224, 71, .5)",
      outline: "3px dashed black",
    });
  });
});

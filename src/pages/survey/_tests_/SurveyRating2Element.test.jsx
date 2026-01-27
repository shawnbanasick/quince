import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SurveyRatings2Element from "../SurveyRating2Element";

vi.mock("../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initialValue) => [initialValue, vi.fn()]),
}));

vi.mock("html-react-parser", () => ({
  default: (html) => html,
}));
vi.mock("../../utilities/decodeHTML", () => ({
  default: (html) => html,
}));

describe("SurveyRatings2Element", () => {
  const defaultProps = {
    opts: {
      itemNum: 1,
      label: "How do you feel?",
      note: "Please be honest",
      options: "Option A;;;Option B",
      scale: "Low;;;High",
      required: "true",
    },
    check: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Initialize resultsSurvey in localStorage as the component expects it to exist
    localStorage.setItem("resultsSurvey", JSON.stringify({}));
  });

  it("renders the label and note text correctly", () => {
    render(<SurveyRatings2Element {...defaultProps} />);

    expect(screen.getByText("How do you feel?")).toBeDefined();
    expect(screen.getByText("Please be honest")).toBeDefined();
  });

  it("renders the correct number of rows based on options", () => {
    render(<SurveyRatings2Element {...defaultProps} />);

    // Each row has 2 radio inputs, 2 rows total = 4 inputs
    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBe(4);
    expect(screen.getByText("Option A")).toBeDefined();
    expect(screen.getByText("Option B")).toBeDefined();
  });

  it("updates localStorage and state when a radio is clicked", () => {
    render(<SurveyRatings2Element {...defaultProps} />);

    const radios = screen.getAllByRole("radio");

    // Click "Option A" -> "High" (the second radio in the first row)
    fireEvent.click(radios[1]);

    expect(radios[1].checked).toBe(true);

    const storedResults = JSON.parse(localStorage.getItem("resultsSurvey"));
    // handleChange logic: if 2nd col is picked, value is "2".
    // Since only one row is answered, the other remains "nr" or triggers "no-*?*-response"
    expect(storedResults["itemNum1"]).toBeDefined();
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SurveyCheckboxElement from "../SurveyCheckboxElement";

// Mock utilities that might break in a test environment
vi.mock("../../utilities/decodeHTML", () => ({ default: (val) => val }));
vi.mock("../../utilities/sanitizeString", () => ({ default: (val) => val }));
const mockSetCheckedState = vi.fn();
vi.mock("../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initialValue) => [initialValue, mockSetCheckedState]),
}));

describe("SurveyCheckboxElement", () => {
  const defaultProps = {
    opts: {
      options: "Option 1;;;Option 2;;;Option 3",
      itemNum: 1,
      id: "q1",
      label: "Select your favorite colors",
      note: "Choose as many as you like",
      other: "true",
      required: "true",
    },
    check: false,
  };

  beforeEach(() => {
    // Clear localStorage and set up the expected initial state
    localStorage.clear();
    localStorage.setItem("resultsSurvey", JSON.stringify({}));
  });

  it("renders the label and note correctly", () => {
    render(<SurveyCheckboxElement {...defaultProps} />);

    expect(screen.getByText("Select your favorite colors")).toBeDefined();
    expect(screen.getByText("Choose as many as you like")).toBeDefined();
  });

  it("renders the correct number of checkboxes based on the options string", () => {
    render(<SurveyCheckboxElement {...defaultProps} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
    expect(screen.getByLabelText("Option 1")).toBeDefined();
  });

  it("updates localStorage when a checkbox is clicked", () => {
    render(<SurveyCheckboxElement {...defaultProps} />);

    const checkbox = screen.getByLabelText("Option 1");
    fireEvent.click(checkbox);

    const results = JSON.parse(localStorage.getItem("resultsSurvey"));
    // Option 1 is index 0, so the value saved is "1"
    expect(results.itemNum1).toBe("1");
  });

  it("enables the 'Other' text input when the last option is selected", () => {
    render(<SurveyCheckboxElement {...defaultProps} />);

    const textInput = screen.getByRole("textbox");
    expect(textInput).toBeDisabled();

    // The last option (Option 3) triggers the 'other' logic in this component
    const lastCheckbox = screen.getByLabelText("Option 3");
    fireEvent.click(lastCheckbox);

    expect(textInput).not.toBeDisabled();
  });

  it("updates the survey results when typing in the 'Other' input", () => {
    render(<SurveyCheckboxElement {...defaultProps} />);

    // Select last option to enable input
    fireEvent.click(screen.getByLabelText("Option 3"));

    const textInput = screen.getByRole("textbox");
    fireEvent.change(textInput, { target: { value: "Custom Value" } });

    const results = JSON.parse(localStorage.getItem("resultsSurvey"));
    // Should contain the index of the checkbox and the custom string
    expect(results.itemNum1).toContain("3-Custom Value");
  });

  it("displays a yellow background/border when a required question is missing and check prop is true", () => {
    const { container } = render(<SurveyCheckboxElement {...defaultProps} check={true} />);

    // The styled-component Container is the first child
    const styledContainer = container.firstChild;

    // Check for the specific warning styles defined in the useEffect
    const styles = window.getComputedStyle(styledContainer);
    expect(styles.backgroundColor).toBe("rgba(253, 224, 71, 0.5)");
    expect(styles.outline).toBe("3px dashed black");
  });
});

import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import SurveyCheckboxElement from "../MobileSurveyCheckboxElement";

// 1. Mock Local Storage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("SurveyCheckboxElement", () => {
  const defaultProps = {
    opts: {
      id: "q1",
      itemNum: 1,
      label: "What colors do you like?",
      options: "Red;;;Blue;;;Green",
      note: "Select all that apply",
      required: true,
      other: true,
    },
    check: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Pre-seed the resultsSurvey object as the component expects it to exist
    localStorage.setItem("resultsSurvey", JSON.stringify({}));
  });

  afterEach(cleanup);

  it("renders the label and options correctly", () => {
    render(<SurveyCheckboxElement {...defaultProps} />);

    expect(screen.getByText("What colors do you like?")).toBeDefined();
    expect(screen.getByLabelText("Red")).toBeDefined();
    expect(screen.getByLabelText("Blue")).toBeDefined();
    expect(screen.getByLabelText("Green")).toBeDefined();
  });

  it("renders the note text when provided", () => {
    render(<SurveyCheckboxElement {...defaultProps} />);
    expect(screen.getByText("Select all that apply")).toBeDefined();
  });

  it("updates checkbox state and localStorage on click", () => {
    render(<SurveyCheckboxElement {...defaultProps} />);

    const checkbox = screen.getByLabelText("Red");
    fireEvent.click(checkbox);

    // Verify it is checked
    expect(checkbox.checked).toBe(true);

    // Verify localStorage was updated (itemNum1 should be "1" because Red is index 0 -> index+1)
    const storedData = JSON.parse(localStorage.getItem("resultsSurvey"));
    expect(storedData.itemNum1).toContain("1");
  });

  it("enables the 'Other' input only when the last option is selected", () => {
    render(<SurveyCheckboxElement {...defaultProps} />);

    const otherInput = screen.getByRole("textbox");
    expect(otherInput).toBeDisabled();

    // The last option in our mock is "Green" (index 2)
    const lastCheckbox = screen.getByLabelText("Green");
    fireEvent.click(lastCheckbox);

    expect(otherInput).not.toBeDisabled();
  });

  it("sanitizes and saves text input for the 'Other' field", () => {
    render(<SurveyCheckboxElement {...defaultProps} />);

    // Enable other field
    const lastCheckbox = screen.getByLabelText("Green");
    fireEvent.click(lastCheckbox);

    const otherInput = screen.getByRole("textbox");
    fireEvent.change(otherInput, { target: { value: "   Yellow   " } });

    const storedData = JSON.parse(localStorage.getItem("resultsSurvey"));
    // Should be '3-Yellow' (3 is the index, Yellow is the trimmed value)
    expect(storedData.itemNum1).toBe("3-Yellow");
  });

  it("applies error styling when required and check prop is true", () => {
    const { container } = render(<SurveyCheckboxElement {...defaultProps} check={true} />);

    // The first child of the component is the styled Container
    const styledContainer = container.firstChild;

    // Check for the dashed border style defined in the useEffect
    const style = window.getComputedStyle(styledContainer);
    expect(style.outline).toContain("dashed");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SurveyDropdownElement from "../MobileSurveyDropdownElement";

// 1. Mock the custom hooks and utilities
vi.mock("../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initialValue) => {
    let value = initialValue;
    const setValue = vi.fn((newValue) => {
      value = newValue;
    });
    return [value, setValue];
  }),
}));

// Mock the MultiSelect component to simplify interaction
vi.mock("react-multi-select-component", () => ({
  MultiSelect: ({ options, value, onChange }) => (
    <select
      data-testid="mock-select"
      multiple
      value={value.map((v) => v.value)}
      onChange={(e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => ({
          label: opt.text,
          value: opt.value,
        }));
        onChange(selectedOptions);
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

describe("SurveyDropdownElement", () => {
  const defaultProps = {
    check: false,
    opts: {
      id: "q1",
      itemNum: 1,
      label: "What is your favorite color?",
      options: "Red;;;Blue;;;Green",
      note: "Please select one or more",
      required: true,
    },
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders the label and note correctly", () => {
    render(<SurveyDropdownElement {...defaultProps} />);

    expect(screen.getByText("What is your favorite color?")).toBeDefined();
    expect(screen.getByText("Please select one or more")).toBeDefined();
  });

  it("shows error styling when required, checked, and no selection is made", () => {
    const { container } = render(<SurveyDropdownElement {...defaultProps} check={true} />);

    // The container is the first child of the render result
    const styledContainer = container.firstChild;

    // Check for the error background color defined in your useEffect
    expect(styledContainer).toHaveStyle("background-color: rgba(253, 224, 71, .5)");
    expect(styledContainer).toHaveStyle("outline: 3px dashed black");
  });
});

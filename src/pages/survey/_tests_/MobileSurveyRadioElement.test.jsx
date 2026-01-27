import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SurveyRadioElement from "../MobileSurveyRadioElement";

// Mocking external utilities
vi.mock("../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initialValue) => [initialValue, vi.fn()]),
}));

vi.mock("../../utilities/sanitizeString", () => ({
  default: vi.fn((str) => str),
}));

// Mocking decodeHTML to return string as is for testing
vi.mock("../../utilities/decodeHTML", () => ({
  default: vi.fn((str) => str),
}));

describe("SurveyRadioElement Component", () => {
  const defaultProps = {
    opts: {
      id: "q1",
      itemNum: 1,
      label: "What is your favorite color?",
      note: "Please select one",
      options: "Red;;;Blue;;;Other",
      other: true,
      required: true,
    },
    check: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear and setup localStorage mock
    localStorage.clear();
    localStorage.setItem("resultsSurvey", JSON.stringify({}));
  });

  it("renders the label and the correct number of radio options", () => {
    render(<SurveyRadioElement {...defaultProps} />);

    expect(screen.getByText("What is your favorite color?")).toBeDefined();
    expect(screen.getByText("Red")).toBeDefined();
    expect(screen.getByText("Blue")).toBeDefined();

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(3);
  });

  it("renders note text when provided", () => {
    render(<SurveyRadioElement {...defaultProps} />);
    expect(screen.getByText("Please select one")).toBeDefined();
  });

  it("updates localStorage when an option is selected", () => {
    render(<SurveyRadioElement {...defaultProps} />);

    const firstOption = screen.getAllByRole("radio")[0];
    fireEvent.click(firstOption);

    const savedData = JSON.parse(localStorage.getItem("resultsSurvey"));
    // itemNum1 should be index + 1 = 1
    expect(savedData.itemNum1).toBe(1);
  });

  it("enables the 'Other' text input only when the last option is selected", () => {
    render(<SurveyRadioElement {...defaultProps} />);

    const otherInput = screen.getByRole("textbox");
    expect(otherInput).toBeDisabled();

    // Select the last option ("Other")
    const radioButtons = screen.getAllByRole("radio");
    fireEvent.click(radioButtons[2]);

    expect(otherInput).not.toBeDisabled();
  });

  it("updates localStorage with custom text when 'Other' input is used", () => {
    render(<SurveyRadioElement {...defaultProps} />);

    // Select "Other"
    const radioButtons = screen.getAllByRole("radio");
    fireEvent.click(radioButtons[2]);

    // Type in the input
    const otherInput = screen.getByRole("textbox");
    fireEvent.change(otherInput, { target: { value: "Purple" } });

    const savedData = JSON.parse(localStorage.getItem("resultsSurvey"));
    // Format: "index+1-inputValue"
    expect(savedData.itemNum1).toBe("3-Purple");
  });

  it("applies error styling when a required question is incomplete and check is triggered", () => {
    const { container } = render(<SurveyRadioElement {...defaultProps} check={true} />);

    // The first div inside the component is the styled Container
    const styledContainer = container.firstChild;

    // Check for the specific error background color defined in your useEffect
    // Note: Vitest/JSDOM sometimes converts hex/rgba, so we check for the expected style property
    expect(styledContainer).toHaveStyle({
      "background-color": "rgba(253, 224, 71, .5)",
      outline: "3px dashed black",
    });
  });
});

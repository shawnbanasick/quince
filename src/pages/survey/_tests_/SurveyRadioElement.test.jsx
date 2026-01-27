import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SurveyRadioElement from "../SurveyRadioElement";

// Mocking external utilities
vi.mock("../../../utilities/useLocalStorage", () => ({
  default: (key, initialValue) => {
    let value = initialValue;
    const setValue = vi.fn((newValue) => {
      value = newValue;
    });
    return [value, setValue];
  },
}));

vi.mock("../../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));

vi.mock("../../../utilities/sanitizeString", () => ({
  default: (str) => str,
}));

describe("SurveyRadioElement", () => {
  const defaultProps = {
    opts: {
      id: "q1",
      itemNum: 1,
      label: "What is your favorite color?",
      note: "Please select one option",
      options: "Red;;;Blue;;;Other",
      other: true,
      required: true,
    },
    check: false,
  };

  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    // Initialize resultsSurvey object as the component expects it to exist
    window.localStorage.setItem("resultsSurvey", JSON.stringify({}));
    vi.clearAllMocks();
  });

  it("renders the question label and options correctly", () => {
    render(<SurveyRadioElement {...defaultProps} />);

    expect(screen.getByText("What is your favorite color?")).toBeInTheDocument();
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  it("updates localStorage when a radio button is selected", async () => {
    render(<SurveyRadioElement {...defaultProps} />);

    const firstOption = screen.getByLabelText("Red");
    await userEvent.click(firstOption);

    const storedData = JSON.parse(window.localStorage.getItem("resultsSurvey"));
    // The component adds 1 to the index: Red is index 0, so it stores 1
    expect(storedData.itemNum1).toBe(1);
  });

  it('enables and updates the "Other" text input when the last option is selected', async () => {
    render(<SurveyRadioElement {...defaultProps} />);

    // Select the last option ("Other")
    const otherRadio = screen.getByLabelText("Other");
    await userEvent.click(otherRadio);

    const textInput = screen.getByRole("textbox");
    expect(textInput).not.toBeDisabled();

    // Type into the "Other" input
    await userEvent.type(textInput, "Green");

    const storedData = JSON.parse(window.localStorage.getItem("resultsSurvey"));
    // Index of 'Other' is 2, so it saves as "3-Green"
    expect(storedData.itemNum1).toBe("3-Green");
  });

  it("shows visual validation (yellow background) when required but not answered", () => {
    // check: true simulates the "Submit" or "Validation" phase
    const requiredProps = { ...defaultProps, check: true };

    const { container } = render(<SurveyRadioElement {...requiredProps} />);

    // The Container is the first child of the render output
    const styledContainer = container.firstChild;

    // Check for the specific validation style from the useEffect
    expect(styledContainer).toHaveStyle("background-color: rgba(253, 224, 71, .5)");
    expect(styledContainer).toHaveStyle("outline: 3px dashed black");
  });
});

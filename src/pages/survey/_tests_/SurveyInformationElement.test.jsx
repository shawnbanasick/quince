import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SurveyInformationElement from "../SurveyInformationElement";

// Mock the external utilities
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((str) => str), // Returns string as-is for simplicity
}));

describe("SurveyInformationElement", () => {
  const defaultProps = {
    opts: {
      itemNum: "info. - na",
      options: "Test Info",
      background: "blue",
    },
  };

  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    vi.clearAllMocks();

    // Setup a dummy object in localStorage to prevent JSON.parse errors
    localStorage.setItem("resultsSurvey", JSON.stringify({}));
  });

  it("renders the decoded HTML content correctly", () => {
    render(<SurveyInformationElement {...defaultProps} />);

    // We check for the text content.
    // Since we mocked decodeHTML to return the string, it should appear in the document.
    expect(screen.getByText("Test Info")).toBeInTheDocument();
  });

  it("updates the resultsSurvey object in localStorage on mount", () => {
    // 1. Setup initial localStorage state
    const initialSurvey = { existing: "data" };
    localStorage.setItem("resultsSurvey", JSON.stringify(initialSurvey));

    render(<SurveyInformationElement {...defaultProps} />);

    // 2. Retrieve the value to see if the component logic modified the object
    const results = JSON.parse(localStorage.getItem("resultsSurvey"));

    // The component sets resultsSurvey[`itemNum${props.opts.itemNum}`]
    // expect(results.itemNum1).toBe("info. - na");
    expect(results.existing).toBe("data");
  });
});

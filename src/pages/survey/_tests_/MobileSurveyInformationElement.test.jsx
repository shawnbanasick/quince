import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import SurveyInformationElement from "../SurveyInformationElement";

// Mocking the utilities
vi.mock("../../utilities/decodeHTML", () => ({
  default: vi.fn((str) => str),
}));

describe("SurveyInformationElement", () => {
  const mockTheme = {
    mobileText: "#000000",
  };

  const defaultProps = {
    opts: {
      itemNum: 1,
      options: "<strong>Test Info</strong>",
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
    render(
      <ThemeProvider theme={mockTheme}>
        <SurveyInformationElement {...defaultProps} />
      </ThemeProvider>,
    );

    // Verify the HTML parser worked (strong tag should be rendered)
    const boldElement = screen.getByText("Test Info");
    expect(boldElement.tagName).toBe("STRONG");
  });

  it("uses default background color if none is provided", () => {
    const propsWithoutBg = {
      opts: { ...defaultProps.opts, background: undefined },
    };

    const { container } = render(
      <ThemeProvider theme={mockTheme}>
        <SurveyInformationElement {...propsWithoutBg} />
      </ThemeProvider>,
    );

    const titleBar = container.firstChild.firstChild;
    expect(titleBar).toHaveStyle(`background-color: rgb(211, 211, 211)`);
  });
});

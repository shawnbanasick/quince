import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoadingScreen from "../StepFinishedModal";
import useSettingsStore from "../../globalState/useSettingsStore";

// 1. Mock the store hook
vi.mock("../../globalState/useSettingsStore", () => ({
  default: vi.fn(),
}));

// 2. Mock the utility (optional, but good for isolation)
vi.mock("./decodeHTML", () => ({
  default: vi.fn((str) => str), // Just return the string as-is for the test
}));

describe("LoadingScreen Component", () => {
  it("renders the message from the language object correctly", () => {
    // Setup the mock state
    const mockLangObj = {
      stepCompleteMessage: "Loading Complete!",
    };

    // Tell the mock hook to return our mock object
    vi.mocked(useSettingsStore).mockReturnValue(mockLangObj);

    render(<LoadingScreen />);

    // Verify the text is in the document
    expect(screen.getByText("Loading Complete!")).toBeInTheDocument();
  });

  it("renders an empty string if the message is missing", () => {
    vi.mocked(useSettingsStore).mockReturnValue({
      stepCompleteMessage: "",
    });

    const { container } = render(<LoadingScreen />);

    // Check if the TextDiv exists but is empty
    const textDiv = container.querySelector("div > div");
    expect(textDiv?.textContent).toBe("");
  });

  it("handles HTML entities by using the parser/decoder", () => {
    const mockHtmlMessage = "<strong>Success &amp; Done</strong>";

    vi.mocked(useSettingsStore).mockReturnValue({
      stepCompleteMessage: mockHtmlMessage,
    });

    render(<LoadingScreen />);

    // Check for the bold element rendered by html-react-parser
    const boldElement = screen.getByText("Success & Done");
    expect(boldElement.tagName).toBe("STRONG");
  });
});

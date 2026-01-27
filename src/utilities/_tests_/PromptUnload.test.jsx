import { render, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import PromptUnload from "../PromptUnload";

// Mock react-router-dom's Prompt component
vi.mock("react-router-dom", () => ({
  Prompt: vi.fn(({ when, message }) => (
    <div data-testid="router-prompt" data-when={when.toString()}>
      {typeof message === "function" ? message() : message}
    </div>
  )),
}));

describe("PromptUnload Component", () => {
  beforeEach(() => {
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("should register the beforeunload event listener on mount", () => {
    render(<PromptUnload />);

    expect(window.addEventListener).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("should remove the beforeunload event listener on unmount", () => {
    const { unmount } = render(<PromptUnload />);

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("should set the returnValue on the event when beforeunload fires", () => {
    render(<PromptUnload />);

    // Find the actual function passed to addEventListener
    const handler = window.addEventListener.mock.calls.find(
      (call) => call[0] === "beforeunload",
    )[1];

    const mockEvent = { returnValue: undefined };
    const result = handler(mockEvent);

    // Modern browsers require the return value and setting returnValue on the event
    expect(mockEvent.returnValue).toBe("o/");
    expect(result).toBe("o/");
  });

  it("renders the React Router Prompt with correct props", async () => {
    const { getByTestId } = render(<PromptUnload />);
    const prompt = getByTestId("router-prompt");

    // In your code, 'when' is explicitly set to false
    expect(prompt.getAttribute("data-when")).toBe("false");
    expect(prompt.textContent).toBe("Are you sure you want to leave this page?");
  });
});

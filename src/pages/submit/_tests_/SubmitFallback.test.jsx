import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SubmitFallback from "../SubmitFallback";

// Mocking the hooks and utilities using factory functions
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: (selector) =>
    selector({
      langObj: {
        fallbackMessage: "Test &lt;b&gt;Message&lt;/b&gt;",
      },
    }),
}));

vi.mock("../../../utilities/decodeHTML", () => ({
  default: (str) => str.replace("&lt;", "<").replace("&gt;", ">"),
}));

// Mocking the child component to keep this a pure unit test
vi.mock("../FallbackButtons", () => ({
  default: () => <div data-testid="fallback-buttons">Buttons Component</div>,
}));

describe("SubmitFallback Component", () => {
  it("renders the FallbackButtons child component", () => {
    render(<SubmitFallback results={[{ id: 1 }]} />);

    expect(screen.getByTestId("fallback-buttons")).toBeDefined();
  });

  it("applies the correct background color to the message container", () => {
    render(<SubmitFallback results={[]} />);

    // Testing the styled-component's output
    const messageContainer = screen.getByText(/Test/i).parentElement;
    const styles = window.getComputedStyle(messageContainer);

    expect(styles.backgroundColor).toBe("rgba(0, 0, 0, 0)");
  });
});

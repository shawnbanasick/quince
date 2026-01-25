import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ExpandViewMessage from "../mobileSortComponents/ExpandViewMessage";

describe("ExpandViewMessage Component", () => {
  it("renders the provided text correctly", () => {
    const testMessage = "Click to expand details";

    render(<ExpandViewMessage text={testMessage} />);

    // Check if the text is in the document
    const messageElement = screen.getByText(testMessage);
    expect(messageElement).toBeDefined();
    expect(messageElement.innerHTML).toBe(testMessage);
  });

  it("is rendered as a div element", () => {
    render(<ExpandViewMessage text="Style Check" />);

    const messageElement = screen.getByText("Style Check");

    // Verifying it uses the underlying styled div
    expect(messageElement.tagName).toBe("DIV");
  });

  it("applies the correct styles (optional)", () => {
    render(<ExpandViewMessage text="Style Check" />);

    const messageElement = screen.getByText("Style Check");

    // Testing specific styled-component CSS
    // Note: requires a browser-like environment (jsdom/happy-dom)
    expect(messageElement).toHaveStyle({
      display: "flex",
      fontWeight: "bold",
      userSelect: "none",
    });
  });
});

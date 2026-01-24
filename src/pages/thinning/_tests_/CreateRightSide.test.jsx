import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CreateRightSide from "../CreateRightSide";

describe("CreateRightSide", () => {
  it("renders with correct text content", () => {
    const rightNum = 5;
    const agreeMostText = "Please select the statements you agree with most";

    const { container } = render(CreateRightSide(rightNum, agreeMostText));

    expect(container.textContent).toContain(agreeMostText);
    expect(container.textContent).toContain("Number of Statements to Select: 5");
  });

  it("renders with different rightNum values", () => {
    const agreeMostText = "Select statements";

    const { container: container1 } = render(CreateRightSide(3, agreeMostText));
    expect(container1.textContent).toContain("Number of Statements to Select: 3");

    const { container: container2 } = render(CreateRightSide(10, agreeMostText));
    expect(container2.textContent).toContain("Number of Statements to Select: 10");
  });

  it("renders with different agreeMostText values", () => {
    const rightNum = 5;

    const { container: container1 } = render(CreateRightSide(rightNum, "First instruction text"));
    expect(container1.textContent).toContain("First instruction text");

    const { container: container2 } = render(CreateRightSide(rightNum, "Different instruction"));
    expect(container2.textContent).toContain("Different instruction");
  });

  it("renders with empty agreeMostText", () => {
    const { container } = render(CreateRightSide(5, ""));

    expect(container.textContent).toContain("Number of Statements to Select: 5");
  });

  it("renders with zero rightNum", () => {
    const { container } = render(CreateRightSide(0, "Test text"));

    expect(container.textContent).toContain("Number of Statements to Select: 0");
  });

  it("has correct component structure", () => {
    const { container } = render(CreateRightSide(5, "Test instruction"));

    // Check that Instructions div exists
    const instructions = container.querySelector("div");
    expect(instructions).toBeInTheDocument();

    // Check that there are two br elements
    const brElements = container.querySelectorAll("br");
    expect(brElements).toHaveLength(2);
  });

  it("applies styled-components correctly", () => {
    const { container } = render(CreateRightSide(5, "Test text"));

    // Verify the styled components are rendered
    const instructions = container.querySelector("div");
    expect(instructions).toBeInTheDocument();

    const spans = container.querySelectorAll("span");
    expect(spans.length).toBeGreaterThan(0);
  });
});

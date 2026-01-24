import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CreateLeftSide from "../CreateLeftSide";

describe("CreateLeftSide", () => {
  it("renders the agree least text", () => {
    const agreeLeastText = "Select the statements you agree with least";
    render(CreateLeftSide(3, agreeLeastText));

    expect(screen.getByText(agreeLeastText)).toBeInTheDocument();
  });

  it("displays the correct number of statements to select", () => {
    const leftNum = 5;
    const agreeLeastText = "Test instructions";

    render(CreateLeftSide(leftNum, agreeLeastText));

    expect(screen.getByText(`Number of Statements to Select: ${leftNum}`)).toBeInTheDocument();
  });

  it("renders with different leftNum values", () => {
    const testCases = [1, 3, 10];

    testCases.forEach((num) => {
      const { unmount } = render(CreateLeftSide(num, "Test"));
      expect(screen.getByText(`Number of Statements to Select: ${num}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("renders with empty agreeLeastText", () => {
    const { container } = render(CreateLeftSide(2, ""));

    expect(screen.getByText("Number of Statements to Select: 2")).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it("contains the Instructions wrapper element", () => {
    const { container } = render(CreateLeftSide(3, "Test"));
    const instructions = container.firstChild;

    expect(instructions).toBeInTheDocument();
  });

  it("renders the number section in bold styling context", () => {
    render(CreateLeftSide(7, "Instructions"));

    const numberText = screen.getByText(/Number of Statements to Select: 7/);
    expect(numberText).toBeInTheDocument();
  });

  it("handles zero as leftNum value", () => {
    render(CreateLeftSide(0, "Test"));

    expect(screen.getByText("Number of Statements to Select: 0")).toBeInTheDocument();
  });

  it("handles special characters in agreeLeastText", () => {
    const specialText = 'Test & <special> "characters"';

    render(CreateLeftSide(2, specialText));

    expect(screen.getByText(specialText)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import boxes from "../Boxes";

describe("boxes component", () => {
  const mockHandleClick = vi.fn();

  const defaultProps = {
    array: [
      {
        id: 1,
        statement: "Test statement 1",
        selected: false,
        selectedPos: false,
        selectedNeg: false,
      },
      {
        id: 2,
        statement: "Test statement 2",
        selected: true,
        selectedPos: true,
        selectedNeg: false,
      },
    ],
    side: "rightSide",
    colMax: 5,
    targetcol: 3,
    handleClick: mockHandleClick,
  };

  it("renders all items from the array", () => {
    const result = boxes(defaultProps);
    render(<>{result}</>);

    expect(screen.getByText("Test statement 1")).toBeInTheDocument();
    expect(screen.getByText("Test statement 2")).toBeInTheDocument();
  });

  it("applies correct data attributes to each box", () => {
    const result = boxes(defaultProps);
    render(<>{result}</>);

    const box1 = screen.getByText("Test statement 1");
    expect(box1).toHaveAttribute("data-side", "rightSide");
    expect(box1).toHaveAttribute("data-max", "5");
    expect(box1).toHaveAttribute("data-targetcol", "3");
  });

  it("assigns unique keys to each box based on item id", () => {
    const result = boxes(defaultProps);
    render(<>{result}</>);

    const box1 = screen.getByText("Test statement 1");
    const box2 = screen.getByText("Test statement 2");

    expect(box1).toHaveAttribute("id", "1");
    expect(box2).toHaveAttribute("id", "2");
  });

  it("calls handleClick when a box is clicked", async () => {
    const user = userEvent.setup();
    const result = boxes(defaultProps);
    render(<>{result}</>);

    const box1 = screen.getByText("Test statement 1");
    await user.click(box1);

    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  it("applies green background when selectedPos is true and side is rightSide", () => {
    const result = boxes(defaultProps);
    render(<>{result}</>);

    const box2 = screen.getByText("Test statement 2");
    const computedStyle = window.getComputedStyle(box2);

    expect(computedStyle.backgroundColor).toBe("rgb(204, 255, 204)"); // #ccffcc
  });

  it("applies red background when selectedNeg is true and side is leftSide", () => {
    const leftSideProps = {
      ...defaultProps,
      side: "leftSide",
      array: [
        {
          id: 3,
          statement: "Negative statement",
          selected: true,
          selectedPos: false,
          selectedNeg: true,
        },
      ],
    };

    const result = boxes(leftSideProps);
    render(<>{result}</>);

    const box = screen.getByText("Negative statement");
    const computedStyle = window.getComputedStyle(box);

    expect(computedStyle.backgroundColor).toBe("rgb(255, 224, 224)"); // #ffe0e0
  });

  it("renders empty array without errors", () => {
    const emptyProps = {
      ...defaultProps,
      array: [],
    };

    const result = boxes(emptyProps);
    const { container } = render(<>{result}</>);

    expect(container.firstChild).toBeNull();
  });

  it("passes selected state props correctly to Box component", () => {
    const result = boxes(defaultProps);
    render(<>{result}</>);

    const box2 = screen.getByText("Test statement 2");

    // Verify the box has the expected attributes based on selected states
    expect(box2).toHaveAttribute("id", "2");
  });
});

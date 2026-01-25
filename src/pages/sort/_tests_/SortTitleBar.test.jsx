import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SortTitleBar from "../mobileSortComponents/SortTitleBar";

// Mock the SVG import since Vitest/JSDOM won't render it natively
vi.mock("../../../assets/helpSymbol.svg?react", () => ({
  default: () => <svg data-testid="help-icon" />,
}));

describe("SortTitleBar Component", () => {
  const defaultProps = {
    background: "rgb(255, 0, 0)",
    conditionsOfInstruction: "Sort these items:",
    onHelpClick: vi.fn(),
  };

  it("renders the instruction text correctly", () => {
    render(<SortTitleBar {...defaultProps} />);
    expect(screen.getByText("Sort these items:")).toBeInTheDocument();
  });

  it("applies the correct background color from props", () => {
    const { container } = render(<SortTitleBar {...defaultProps} />);

    // The first child should be the TitleBarContainer
    const titleBar = container.firstChild;
    expect(titleBar).toHaveStyle(`background-color: ${defaultProps.background}`);
  });

  it("calls onHelpClick when the help icon is clicked", () => {
    render(<SortTitleBar {...defaultProps} />);

    // Find the container by its role or the icon inside it
    const helpBtn = screen.getByTestId("help-icon").parentElement;
    fireEvent.click(helpBtn);

    expect(defaultProps.onHelpClick).toHaveBeenCalledTimes(1);
  });

  it("renders the help icon SVG", () => {
    render(<SortTitleBar {...defaultProps} />);
    expect(screen.getByTestId("help-icon")).toBeInTheDocument();
  });
});

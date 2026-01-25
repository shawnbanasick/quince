import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SortItem from "../mobileSortComponents/SortItem";
import { ThemeProvider } from "styled-components";

// Mocking SVG imports which often break in test environments
vi.mock("../../../assets/downArrows.svg?react", () => ({
  default: () => <svg data-testid="down-arrow-svg" />,
}));
vi.mock("../../../assets/upArrows.svg?react", () => ({
  default: () => <svg data-testid="up-arrow-svg" />,
}));

describe("SortItem Component", () => {
  const mockItem = {
    id: "test-123",
    statement: "Hello World",
    selected: false,
    externalIndex: 0,
    characteristics: {
      color: "blue",
      value: 1,
      header: "Test Header",
    },
  };

  const defaultProps = {
    item: mockItem,
    fontSize: 2,
    onCardSelected: vi.fn(),
    onClickUp: vi.fn(),
    onClickDown: vi.fn(),
  };

  // Helper to wrap with ThemeProvider if your styled-components use theme variables
  const renderWithTheme = (ui) => {
    return render(<ThemeProvider theme={{ mobileText: "#000" }}>{ui}</ThemeProvider>);
  };

  it("renders the statement text correctly", () => {
    renderWithTheme(<SortItem {...defaultProps} />);
    expect(screen.getByText("Hello World")).toBeDefined();
  });

  it("calls onClickUp when the up arrow container is clicked", () => {
    renderWithTheme(<SortItem {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]); // The second button is the UpArrow
    expect(defaultProps.onClickUp).toHaveBeenCalledTimes(1);
  });

  it("calls onCardSelected when the main text area is clicked", () => {
    renderWithTheme(<SortItem {...defaultProps} />);
    const textElement = screen.getByText("Hello World");
    fireEvent.click(textElement);
    expect(defaultProps.onCardSelected).toHaveBeenCalledTimes(1);
  });

  it("passes data attributes correctly to the internal div", () => {
    renderWithTheme(<SortItem {...defaultProps} />);
    const content = screen.getByText("Hello World");

    expect(content.getAttribute("data-id")).toBe("test-123");
    expect(content.getAttribute("data-group_num")).toBe("1");
    expect(content.getAttribute("data-font_size")).toBe("2");
  });
});

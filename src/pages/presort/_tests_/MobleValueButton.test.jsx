import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import MobileValueButton from "../MobileValueButton";

// Mock theme since your styled-component accesses props.theme.mobileText
const mockTheme = {
  mobileText: "#ffffff",
};

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe("MobileValueButton Component", () => {
  it("renders the child content correctly", () => {
    renderWithTheme(<MobileValueButton child={<span data-testid="child">Click Me</span>} />);

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("calls onClick when touched (onTouchStart)", () => {
    const handleClick = vi.fn();
    renderWithTheme(<MobileValueButton onClick={handleClick} child="Button" />);

    const button = screen.getByText("Button");
    fireEvent.touchStart(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies the correct background color from props", () => {
    const testColor = "rgb(255, 0, 0)"; // Red
    renderWithTheme(<MobileValueButton color={testColor} child="Colored Button" />);

    const container = screen.getByText("Colored Button");

    // Check if the styled-component applied the background-color prop
    expect(container).toHaveStyle(`background-color: ${testColor}`);
  });

  it("uses the theme color for text", () => {
    renderWithTheme(<MobileValueButton child="Themed Button" />);

    const container = screen.getByText("Themed Button");

    // Verifying it picks up props.theme.mobileText
    expect(container).toHaveStyle(`color: ${mockTheme.mobileText}`);
  });
});

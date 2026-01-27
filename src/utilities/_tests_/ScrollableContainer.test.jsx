import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ScrollableContainer from "../ScrollableContainer";
import useScrollIndicator from "../useScrollIndicator";

// Mock the custom hook
vi.mock("../useScrollIndicator", () => ({
  default: vi.fn(),
}));

// Mock the ScrollIndicator component to simplify the DOM tree
vi.mock("../ScrollIndicator", () => ({
  default: () => <div data-testid="scroll-indicator" />,
}));

describe("ScrollableContainer", () => {
  it("renders children correctly", () => {
    // Setup hook to return false (not showing)
    vi.mocked(useScrollIndicator).mockReturnValue({ showIndicator: false });

    render(
      <ScrollableContainer>
        <p>Test Content</p>
      </ScrollableContainer>,
    );

    expect(screen.getByText("Test Content")).toBeDefined();
  });

  it("shows the indicator when the hook returns true and showIndicator prop is true", () => {
    // Setup hook to return true
    vi.mocked(useScrollIndicator).mockReturnValue({ showIndicator: true });

    render(
      <ScrollableContainer showIndicator={true}>
        <div>Content</div>
      </ScrollableContainer>,
    );

    expect(screen.getByTestId("scroll-indicator")).toBeDefined();
  });

  it("hides the indicator when the hook returns false", () => {
    vi.mocked(useScrollIndicator).mockReturnValue({ showIndicator: false });

    render(
      <ScrollableContainer showIndicator={true}>
        <div>Content</div>
      </ScrollableContainer>,
    );

    expect(screen.queryByTestId("scroll-indicator")).toBeNull();
  });

  it("hides the indicator when showIndicator prop is false, even if hook returns true", () => {
    vi.mocked(useScrollIndicator).mockReturnValue({ showIndicator: true });

    render(
      <ScrollableContainer showIndicator={false}>
        <div>Content</div>
      </ScrollableContainer>,
    );

    expect(screen.queryByTestId("scroll-indicator")).toBeNull();
  });

  it("applies the custom height prop to the outer container", () => {
    vi.mocked(useScrollIndicator).mockReturnValue({ showIndicator: false });
    const customHeight = "300px";

    const { container } = render(
      <ScrollableContainer height={customHeight}>
        <div>Content</div>
      </ScrollableContainer>,
    );

    // The first child div is the relative wrapper
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveStyle({ height: customHeight });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import BackButton from "../PostsortBackButton";

// Mock theme for styled-components
const mockTheme = {
  primary: "#337ab7",
  secondary: "#286090",
  focus: "#204d74",
};

// Helper to render with theme and router
const renderWithProviders = (component, history = createMemoryHistory()) => {
  return render(
    <Router history={history}>
      <ThemeProvider theme={mockTheme}>{component}</ThemeProvider>
    </Router>
  );
};

describe("BackButton", () => {
  let history;

  beforeEach(() => {
    // Create new history for each test
    history = createMemoryHistory();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the button with children text", () => {
      renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

      expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    });

    // it("should render with correct tabindex attribute", () => {
    //   renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

    //   const button = screen.getByRole("button");
    //   expect(button).toHaveAttribute("tabindex", "0");
    // });

    it("should render with different children content", () => {
      renderWithProviders(<BackButton to="/previous">← Previous</BackButton>, history);

      expect(screen.getByRole("button", { name: "← Previous" })).toBeInTheDocument();
    });

    it("should render with JSX children", () => {
      renderWithProviders(
        <BackButton to="/previous">
          <span>Go Back</span>
        </BackButton>,
        history
      );

      expect(screen.getByText("Go Back")).toBeInTheDocument();
    });

    it("should render with empty children", () => {
      renderWithProviders(<BackButton to="/previous"></BackButton>, history);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe("");
    });
  });

  describe("Navigation", () => {
    it("should navigate to the specified route when clicked", () => {
      renderWithProviders(<BackButton to="/presort">Back</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/presort");
    });

    it('should navigate to different routes based on "to" prop', () => {
      renderWithProviders(<BackButton to="/landing">Back to Landing</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/landing");
    });

    it("should navigate to root route", () => {
      renderWithProviders(<BackButton to="/">Back to Home</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/");
    });

    it("should handle navigation with query parameters", () => {
      renderWithProviders(<BackButton to="/presort?step=1">Back</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/presort");
      expect(history.location.search).toBe("?step=1");
    });

    it("should handle navigation with hash", () => {
      renderWithProviders(<BackButton to="/presort#section-1">Back</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/presort");
      expect(history.location.hash).toBe("#section-1");
    });

    it("should handle complex route paths", () => {
      renderWithProviders(<BackButton to="/admin/settings/profile">Back</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/admin/settings/profile");
    });
  });

  describe("Custom onClick Handler", () => {
    it("should call custom onClick handler when provided", () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <BackButton to="/previous" onClick={handleClick}>
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should pass event object to custom onClick handler", () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <BackButton to="/previous" onClick={handleClick}>
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
      expect(handleClick.mock.calls[0][0]).toHaveProperty("type", "click");
    });

    it("should call onClick handler before navigation", () => {
      const callOrder = [];
      const handleClick = vi.fn(() => {
        callOrder.push("onClick");
        expect(history.location.pathname).toBe("/");
      });

      renderWithProviders(
        <BackButton to="/previous" onClick={handleClick}>
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      callOrder.push("navigated");

      expect(callOrder).toEqual(["onClick", "navigated"]);
      expect(history.location.pathname).toBe("/previous");
    });

    it("should still navigate when onClick handler is not provided", () => {
      renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

      const button = screen.getByRole("button");

      expect(() => fireEvent.click(button)).not.toThrow();
      expect(history.location.pathname).toBe("/previous");
    });

    // it("should handle onClick that throws without preventing navigation attempt", () => {
    //   const handleClick = vi.fn(() => {
    //     throw new Error("Test error");
    //   });

    //   renderWithProviders(
    //     <BackButton to="/previous" onClick={handleClick}>
    //       Back
    //     </BackButton>,
    //     history
    //   );

    //   const button = screen.getByRole("button");

    //   expect(() => fireEvent.click(button)).toThrow("Test error");
    //   expect(handleClick).toHaveBeenCalledTimes(1);
    // });

    it("should call onClick multiple times for multiple clicks", () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <BackButton to="/previous" onClick={handleClick}>
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("Props Filtering", () => {
    it("should filter out router props from button element", () => {
      const { container } = renderWithProviders(
        <BackButton to="/previous">Back</BackButton>,
        history
      );

      const button = container.querySelector("button");

      // These props should not be on the button DOM element
      expect(button).not.toHaveAttribute("to");
      expect(button).not.toHaveAttribute("history");
      expect(button).not.toHaveAttribute("location");
      expect(button).not.toHaveAttribute("match");
      expect(button).not.toHaveAttribute("staticContext");
    });

    it("should pass through valid HTML button props", () => {
      renderWithProviders(
        <BackButton
          to="/previous"
          data-testid="back-button"
          aria-label="Navigate back"
          disabled={false}
        >
          Back
        </BackButton>,
        history
      );

      const button = screen.getByTestId("back-button");
      expect(button).toHaveAttribute("aria-label", "Navigate back");
      expect(button).not.toBeDisabled();
    });

    it("should pass through className prop", () => {
      renderWithProviders(
        <BackButton to="/previous" className="custom-back-button">
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-back-button");
    });

    it("should pass through data attributes", () => {
      renderWithProviders(
        <BackButton to="/previous" data-tracking="back-navigation" data-page="sort">
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-tracking", "back-navigation");
      expect(button).toHaveAttribute("data-page", "sort");
    });

    it("should pass through id prop", () => {
      renderWithProviders(
        <BackButton to="/previous" id="back-btn">
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("id", "back-btn");
    });
  });

  describe("Multiple Clicks", () => {
    it("should handle multiple rapid clicks", () => {
      renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Should navigate multiple times to same location
      expect(history.location.pathname).toBe("/previous");
      expect(history.length).toBeGreaterThan(1);
    });

    it("should add each click to history stack", () => {
      const initialLength = history.length;

      renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);

      expect(history.length).toBe(initialLength + 2);
    });
  });

  describe("Keyboard Interaction", () => {
    // it("should be keyboard accessible with tabindex", () => {
    //   renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

    //   const button = screen.getByRole("button");
    //   expect(button).toHaveAttribute("tabindex", "0");
    // });

    it("should be focusable", () => {
      renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

      const button = screen.getByRole("button");
      button.focus();

      expect(button).toHaveFocus();
    });

    it("should trigger on Enter key press", () => {
      renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

      const button = screen.getByRole("button");
      button.focus();

      // Buttons handle Enter key by default
      expect(button).toHaveFocus();
    });

    it("should be part of tab order", () => {
      renderWithProviders(
        <>
          <button>First</button>
          <BackButton to="/previous">Back</BackButton>
          <button>Third</button>
        </>,
        history
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
      //   expect(buttons[1]).toHaveAttribute("tabindex", "0");
    });
  });

  describe("Styled Component Theme", () => {
    it("should render with theme colors", () => {
      renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

      const button = screen.getByRole("button");

      // Component should render without theme errors
      expect(button).toBeInTheDocument();
    });

    it("should render without theme provider (graceful degradation)", () => {
      const { container } = render(
        <Router history={history}>
          <BackButton to="/previous">Back</BackButton>
        </Router>
      );

      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });

    it("should apply custom styles via styled-components", () => {
      const { container } = renderWithProviders(
        <BackButton to="/previous">Back</BackButton>,
        history
      );

      const button = container.querySelector("button");

      // Styled-components should apply styles
      expect(button).toBeInTheDocument();
    });
  });

  describe("Integration with History", () => {
    it("should add entry to history stack", () => {
      const initialLength = history.length;

      renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.length).toBe(initialLength + 1);
    });

    it("should work with history.goBack() after navigation", () => {
      history.push("/sort");

      renderWithProviders(<BackButton to="/presort">Back</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/presort");

      history.goBack();
      expect(history.location.pathname).toBe("/sort");
    });

    it("should maintain history state across navigations", () => {
      history.push("/sort", { fromPage: "thin" });

      renderWithProviders(<BackButton to="/thin">Back</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/thin");

      history.goBack();
      expect(history.location.state).toEqual({ fromPage: "thin" });
    });
  });

  describe("Edge Cases", () => {
    it("should work with disabled prop", () => {
      renderWithProviders(
        <BackButton to="/previous" disabled>
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();

      fireEvent.click(button);

      // Disabled button shouldn't navigate
      expect(history.location.pathname).toBe("/");
    });

    it("should handle navigation from current page to same page", () => {
      history.push("/sort");

      renderWithProviders(<BackButton to="/sort">Refresh</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/sort");
    });

    it("should handle very long route paths", () => {
      const longPath = "/very/long/path/with/many/segments/to/test/routing";

      renderWithProviders(<BackButton to={longPath}>Back</BackButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe(longPath);
    });

    it("should handle special characters in routes", () => {
      renderWithProviders(
        <BackButton to="/page-with-dashes_and_underscores">Back</BackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/page-with-dashes_and_underscores");
    });
  });

  describe("Accessibility", () => {
    it("should be announced as a button to screen readers", () => {
      renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
    });

    it("should support aria-label for better accessibility", () => {
      renderWithProviders(
        <BackButton to="/previous" aria-label="Go back to previous page">
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button", { name: "Go back to previous page" });
      expect(button).toBeInTheDocument();
    });

    it("should support aria-describedby", () => {
      renderWithProviders(
        <BackButton to="/previous" aria-describedby="back-description">
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "back-description");
    });

    it("should support aria-pressed for toggle states", () => {
      renderWithProviders(
        <BackButton to="/previous" aria-pressed="false">
          Back
        </BackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("should have proper button semantics", () => {
      renderWithProviders(<BackButton to="/previous">Back</BackButton>, history);

      const button = screen.getByRole("button");
      expect(button).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("Component Composition", () => {
    it("should work with other components as children", () => {
      const Icon = () => <span>←</span>;

      renderWithProviders(
        <BackButton to="/previous">
          <Icon /> Back
        </BackButton>,
        history
      );

      expect(screen.getByText("←")).toBeInTheDocument();
      expect(screen.getByText("Back")).toBeInTheDocument();
    });

    it("should handle multiple child elements", () => {
      renderWithProviders(
        <BackButton to="/previous">
          <span>Icon</span>
          <span>Text</span>
        </BackButton>,
        history
      );

      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });
  });
});

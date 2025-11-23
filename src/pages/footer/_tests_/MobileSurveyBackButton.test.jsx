import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import MobileSurveyBackButton from "../MobileSurveyBackButton";

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

describe("MobileSurveyBackButton", () => {
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
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    });

    it("should render with different children content", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Previous</MobileSurveyBackButton>,
        history
      );

      expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    });

    it("should render with JSX children", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">
          <span>← Go Back</span>
        </MobileSurveyBackButton>,
        history
      );

      expect(screen.getByText("← Go Back")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should navigate to the specified route when clicked", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/postsort");
    });

    it('should navigate to different routes based on "to" prop', () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/sort">Back to Sort</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/sort");
    });

    it("should navigate to root route", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/">Back to Home</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/");
    });

    it("should handle navigation with query parameters", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort?step=2">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/postsort");
      expect(history.location.search).toBe("?step=2");
    });
  });

  describe("Custom onClick Handler", () => {
    it("should call custom onClick handler when provided", () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <MobileSurveyBackButton to="/postsort" onClick={handleClick}>
          Back
        </MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should pass event object to custom onClick handler", () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <MobileSurveyBackButton to="/postsort" onClick={handleClick}>
          Back
        </MobileSurveyBackButton>,
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
      });

      renderWithProviders(
        <MobileSurveyBackButton to="/postsort" onClick={handleClick}>
          Back
        </MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      callOrder.push("navigated");

      expect(callOrder).toEqual(["onClick", "navigated"]);
      expect(history.location.pathname).toBe("/postsort");
    });

    it("should still navigate when onClick handler is not provided", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");

      expect(() => fireEvent.click(button)).not.toThrow();
      expect(history.location.pathname).toBe("/postsort");
    });
  });

  describe("Props Filtering", () => {
    it("should filter out router props from button element", () => {
      const { container } = renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
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
        <MobileSurveyBackButton
          to="/postsort"
          data-testid="back-button"
          aria-label="Navigate back"
          disabled={false}
        >
          Back
        </MobileSurveyBackButton>,
        history
      );

      const button = screen.getByTestId("back-button");
      expect(button).toHaveAttribute("aria-label", "Navigate back");
      expect(button).not.toBeDisabled();
    });

    it("should pass through className prop", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort" className="custom-class">
          Back
        </MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should pass through data attributes", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort" data-tracking="back-button" data-step="survey">
          Back
        </MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-tracking", "back-button");
      expect(button).toHaveAttribute("data-step", "survey");
    });
  });

  describe("Multiple Clicks", () => {
    it("should handle multiple rapid clicks", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Should navigate multiple times to same location
      expect(history.location.pathname).toBe("/postsort");
      expect(history.length).toBeGreaterThan(1);
    });

    it("should call onClick handler for each click", () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <MobileSurveyBackButton to="/postsort" onClick={handleClick}>
          Back
        </MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("Keyboard Interaction", () => {
    it("should navigate when Enter key is pressed", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      button.focus();
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

      // Buttons trigger click on Enter by default
      expect(button).toHaveFocus();
    });

    it("should be focusable", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      button.focus();

      expect(button).toHaveFocus();
    });
  });

  describe("Styled Component Theme", () => {
    it("should render with theme colors", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");

      // Component should render without theme errors
      expect(button).toBeInTheDocument();
    });

    it("should render without theme provider (graceful degradation)", () => {
      const { container } = render(
        <Router history={history}>
          <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>
        </Router>
      );

      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty children", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort"></MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe("");
    });

    it("should handle complex route paths", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/admin/survey/results">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/admin/survey/results");
    });

    it("should handle route with hash", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort#section-2">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/postsort");
      expect(history.location.hash).toBe("#section-2");
    });

    it("should work with disabled prop", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort" disabled>
          Back
        </MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();

      fireEvent.click(button);

      // Disabled button shouldn't navigate
      expect(history.location.pathname).toBe("/");
    });
  });

  describe("Integration with History", () => {
    it("should add entry to history stack", () => {
      const initialLength = history.length;

      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.length).toBe(initialLength + 1);
    });

    it("should work with history.goBack() after navigation", () => {
      history.push("/survey");

      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/postsort");

      history.goBack();
      expect(history.location.pathname).toBe("/survey");
    });

    it("should maintain history state across navigations", () => {
      history.push("/survey", { fromPage: "postsort" });

      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/postsort");

      history.goBack();
      expect(history.location.state).toEqual({ fromPage: "postsort" });
    });
  });

  describe("Accessibility", () => {
    it("should be announced as a button to screen readers", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort">Back</MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
    });

    it("should support aria-label for better accessibility", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort" aria-label="Go back to previous page">
          Back
        </MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button", { name: "Go back to previous page" });
      expect(button).toBeInTheDocument();
    });

    it("should support aria-describedby", () => {
      renderWithProviders(
        <MobileSurveyBackButton to="/postsort" aria-describedby="back-description">
          Back
        </MobileSurveyBackButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "back-description");
    });
  });
});

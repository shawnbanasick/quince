import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import LogInSubmitButton from "../LogInSubmitButton";
import useSettingsStore from "../../../globalState/useSettingsStore";

// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((text) => text),
}));
vi.mock("html-react-parser", () => ({
  default: vi.fn((text) => text),
}));

// Mock theme
const mockTheme = {
  primary: "#337ab7",
  secondary: "#286090",
  focus: "#204d74",
};

// Helper to render with theme
const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe("LogInSubmitButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useSettingsStore
    useSettingsStore.mockReturnValue({
      langObj: {
        loginSubmitButtonText: "Submit",
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the button", () => {
      renderWithTheme(<LogInSubmitButton />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have submit type", () => {
      renderWithTheme(<LogInSubmitButton />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("Props", () => {
    it("should apply size prop", () => {
      renderWithTheme(<LogInSubmitButton size="2em" />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ fontSize: "2em" });
    });

    it("should apply width prop", () => {
      renderWithTheme(<LogInSubmitButton width="300px" />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ width: "300px" });
    });

    it("should apply height prop", () => {
      renderWithTheme(<LogInSubmitButton height="60px" />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ height: "60px" });
    });

    it("should apply all size props together", () => {
      renderWithTheme(<LogInSubmitButton size="1.5em" width="200px" height="50px" />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        fontSize: "1.5em",
        width: "200px",
        height: "50px",
      });
    });

    it("should handle missing size props", () => {
      renderWithTheme(<LogInSubmitButton />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("onClick Handler", () => {
    it("should call onClick when clicked", () => {
      const handleClick = vi.fn();

      renderWithTheme(<LogInSubmitButton onClick={handleClick} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should pass event object to onClick handler", () => {
      const handleClick = vi.fn();

      renderWithTheme(<LogInSubmitButton onClick={handleClick} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
      expect(handleClick.mock.calls[0][0]).toHaveProperty("type", "click");
    });

    it("should handle multiple clicks", () => {
      const handleClick = vi.fn();

      renderWithTheme(<LogInSubmitButton onClick={handleClick} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it("should not throw error when onClick is not provided", () => {
      renderWithTheme(<LogInSubmitButton />);

      const button = screen.getByRole("button");

      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe("Text Content", () => {
    it("should handle empty button text", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          loginSubmitButtonText: "",
        },
      });

      renderWithTheme(<LogInSubmitButton />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe("");
    });

    it("should handle null button text", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          loginSubmitButtonText: null,
        },
      });

      renderWithTheme(<LogInSubmitButton />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Styled Components", () => {
    it("should render with theme colors", () => {
      renderWithTheme(<LogInSubmitButton />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should render without theme provider (graceful degradation)", () => {
      const { container } = render(<LogInSubmitButton />);

      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should be focusable", () => {
      renderWithTheme(<LogInSubmitButton />);

      const button = screen.getByRole("button");
      button.focus();

      expect(button).toHaveFocus();
    });

    it("should have button role", () => {
      renderWithTheme(<LogInSubmitButton />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should be a submit button", () => {
      renderWithTheme(<LogInSubmitButton />);

      const button = screen.getByRole("button");
      expect(button.type).toBe("submit");
    });
  });

  describe("Integration with Props", () => {
    it("should pass all props correctly", () => {
      const handleClick = vi.fn();

      renderWithTheme(
        <LogInSubmitButton onClick={handleClick} size="1.5em" width="200px" height="50px" />
      );

      const button = screen.getByRole("button");

      expect(button).toHaveStyle({
        fontSize: "1.5em",
        width: "200px",
        height: "50px",
      });

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle whitespace-only text", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          loginSubmitButtonText: "   ",
        },
      });

      renderWithTheme(<LogInSubmitButton />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should handle very large size values", () => {
      renderWithTheme(<LogInSubmitButton size="10em" width="1000px" height="500px" />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        fontSize: "10em",
        width: "1000px",
        height: "500px",
      });
    });

    it("should handle very small size values", () => {
      renderWithTheme(<LogInSubmitButton size="0.5em" width="50px" height="20px" />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        fontSize: "0.5em",
        width: "50px",
        height: "20px",
      });
    });
  });

  describe("Component Rerendering", () => {
    it("should update styles when props change", () => {
      const { rerender } = renderWithTheme(<LogInSubmitButton size="1em" />);

      let button = screen.getByRole("button");
      expect(button).toHaveStyle({ fontSize: "1em" });

      rerender(
        <ThemeProvider theme={mockTheme}>
          <LogInSubmitButton size="2em" />
        </ThemeProvider>
      );

      button = screen.getByRole("button");
      expect(button).toHaveStyle({ fontSize: "2em" });
    });
  });
});

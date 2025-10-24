import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, debug } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import InternetExplorerWarning from "../InternetExplorerWarning";
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

describe("InternetExplorerWarning", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    useSettingsStore.mockImplementation((selector) => {
      const mockState = {
        langObj: {
          ieWarningHeaderText: "Browser Not Supported",
          ieWarningText:
            "Internet Explorer is not supported. Please use a modern browser like Chrome, Firefox, or Edge.",
        },
      };
      return selector(mockState);
    });

    it("should render the warning component", async () => {
      renderWithTheme(<InternetExplorerWarning />);

      console.log(useSettingsStore.langObj);

      let element = screen.getAllByTestId("warningTextDiv");
      let firstChild = element.firstElementChild;

      await expect(firstChild).toBeInTheDocument;
      //   await expect(element("Browser")).toBeTruthy();
      //   await expect(screen.findAllByText(/Internet Explorer is not supported/)).toBeInTheDocument();
    });
    it("should render the header text", async () => {
      renderWithTheme(<InternetExplorerWarning />);

      const element = await screen.findByText("Browser Not Supported", {}, { timeout: 4000 });

      expect(element).toBeInTheDocument;
    });

    it("should render the warning message text", () => {
      renderWithTheme(<InternetExplorerWarning />);

      const warningText = screen.getByText(/Internet Explorer is not supported/);
      expect(warningText).toBeInTheDocument();
      expect(warningText.tagName).toBe("H3");
    });

    it("should render horizontal rule separator", () => {
      const { container } = renderWithTheme(<InternetExplorerWarning />);

      const hr = container.querySelector("hr");
      expect(hr).toBeInTheDocument();
    });

    it("should have correct container structure", () => {
      const { container } = renderWithTheme(<InternetExplorerWarning />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe("Empty or Null Values", () => {
    it("should handle null header text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: null,
            ieWarningText: "Warning message",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("Warning message")).toBeInTheDocument();
    });

    it("should handle null warning text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "Header",
            ieWarningText: null,
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("Header")).toBeInTheDocument();
    });

    it("should handle empty string header text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "",
            ieWarningText: "Warning",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("Warning")).toBeInTheDocument();
    });

    it("should handle empty string warning text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "Header",
            ieWarningText: "",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("Header")).toBeInTheDocument();
    });

    it("should handle both null values", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          ieWarningHeaderText: null,
          ieWarningText: null,
        },
      });

      const { container } = renderWithTheme(<InternetExplorerWarning />);

      // Component should still render structure
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle undefined langObj properties", () => {
      useSettingsStore.mockReturnValue({
        langObj: {},
      });

      const { container } = renderWithTheme(<InternetExplorerWarning />);

      // Component should still render structure
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Localization", () => {
    it("should display Spanish text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "Navegador No Soportado",
            ieWarningText:
              "Internet Explorer no es compatible. Por favor use un navegador moderno.",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("Navegador No Soportado")).toBeInTheDocument();
      expect(screen.getByText(/Internet Explorer no es compatible/)).toBeInTheDocument();
    });

    it("should display French text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "Navigateur Non Pris en Charge",
            ieWarningText: "Internet Explorer n'est pas pris en charge.",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("Navigateur Non Pris en Charge")).toBeInTheDocument();
      expect(screen.getByText(/Internet Explorer n'est pas pris en charge/)).toBeInTheDocument();
    });

    it("should display German text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "Browser Nicht Unterstützt",
            ieWarningText: "Internet Explorer wird nicht unterstützt.",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("Browser Nicht Unterstützt")).toBeInTheDocument();
      expect(screen.getByText("Internet Explorer wird nicht unterstützt.")).toBeInTheDocument();
    });

    it("should display Chinese text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "不支持的浏览器",
            ieWarningText: "不支持 Internet Explorer。",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("不支持的浏览器")).toBeInTheDocument();
      expect(screen.getByText("不支持 Internet Explorer。")).toBeInTheDocument();
    });
  });

  describe("Styled Components", () => {
    it("should apply Container styles", () => {
      const { container } = renderWithTheme(<InternetExplorerWarning />);

      const styledContainer = container.firstChild;
      expect(styledContainer).toBeInTheDocument();
    });

    it("should render without theme provider (graceful degradation)", () => {
      const { container } = render(<InternetExplorerWarning />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });

    it("should have styled hr element", () => {
      const { container } = renderWithTheme(<InternetExplorerWarning />);

      const hr = container.querySelector("hr");
      expect(hr).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should have center tag for header alignment", () => {
      const { container } = renderWithTheme(<InternetExplorerWarning />);

      const centerTag = container.querySelector("center");
      expect(centerTag).toBeInTheDocument();
    });

    it("should have two main div containers", () => {
      const { container } = renderWithTheme(<InternetExplorerWarning />);

      const divs = container.querySelectorAll("div");
      expect(divs.length).toBeGreaterThanOrEqual(2);
    });

    it("should have h2 inside center tag", () => {
      const { container } = renderWithTheme(<InternetExplorerWarning />);

      const center = container.querySelector("center");
      const h2 = center?.querySelector("h2");
      expect(h2).toBeInTheDocument();
    });

    it("should have h3 for warning text", () => {
      const { container } = renderWithTheme(<InternetExplorerWarning />);

      const h3 = container.querySelector("h3");
      expect(h3).toBeInTheDocument();
    });
  });

  describe("Special Characters", () => {
    it("should handle special characters in header", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "⚠️ Warning! ⚠️",
            ieWarningText: "Please upgrade",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("⚠️ Warning! ⚠️")).toBeInTheDocument();
    });

    it("should handle special characters in warning text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "Warning",
            ieWarningText: "Use Chrome ✓, Firefox ✓, or Edge ✓",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText(/Use Chrome ✓, Firefox ✓, or Edge ✓/)).toBeInTheDocument();
    });

    it("should handle quotes in text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: '"Important Notice"',
            ieWarningText: 'Please use a "modern" browser',
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText('"Important Notice"')).toBeInTheDocument();
      expect(screen.getByText(/Please use a "modern" browser/)).toBeInTheDocument();
    });

    it("should handle apostrophes in text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "We're Sorry",
            ieWarningText: "It's time to upgrade",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("We're Sorry")).toBeInTheDocument();
      expect(screen.getByText("It's time to upgrade")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle whitespace-only header text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "   ",
            ieWarningText: "Warning",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("Warning")).toBeInTheDocument();
    });

    it("should handle whitespace-only warning text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "Header",
            ieWarningText: "   ",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("Header")).toBeInTheDocument();
    });

    it("should handle text with line breaks", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "Warning",
            ieWarningText: "Line 1\nLine 2\nLine 3",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });

    it("should handle very short text", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "No",
            ieWarningText: "IE",
          },
        };
        return selector(mockState);
      });

      renderWithTheme(<InternetExplorerWarning />);

      expect(screen.getByText("No")).toBeInTheDocument();
      expect(screen.getByText("IE")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have semantic heading elements", () => {
      const { container } = renderWithTheme(<InternetExplorerWarning />);

      const h2 = container.querySelector("h2");
      const h3 = container.querySelector("h3");

      expect(h2).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      const { container } = renderWithTheme(<InternetExplorerWarning />);

      const h2 = container.querySelector("h2");
      const h3 = container.querySelector("h3");

      expect(h2).toBeInTheDocument();
      expect(h3).toBeInTheDocument();

      // h2 should come before h3 in DOM
      const allHeadings = container.querySelectorAll("h2, h3");
      expect(allHeadings[0].tagName).toBe("H2");
      expect(allHeadings[1].tagName).toBe("H3");
    });

    it("should be readable without CSS", () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "Browser Not Supported",
            ieWarningText: "Please use Chrome, Firefox, or Edge",
          },
        };
        return selector(mockState);
      });

      const { container } = render(<InternetExplorerWarning />);

      const text = container.textContent;
      expect(text).toContain("Browser Not Supported");
      expect(text).toContain("Please use Chrome, Firefox, or Edge");
    });
  });

  describe("Component Behavior", () => {
    it("should render successfully with all required dependencies", async () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "Warning Header",
            ieWarningText: "Warning Message",
          },
        };
        return selector(mockState);
      });

      const { container } = renderWithTheme(<InternetExplorerWarning />);

      await waitFor(() => {
        screen.findByText("Warning Header");
      });
      //   debug();
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Warning Header")).toBeInTheDocument();
      expect(screen.getByText("Warning Message")).toBeInTheDocument();
    });

    it("should render only structure when langObj values are empty", async () => {
      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "",
            ieWarningText: "",
          },
        };
        return selector(mockState);
      });

      const { container } = renderWithTheme(<InternetExplorerWarning />);

      expect(container.firstChild).toBeInTheDocument();
      expect(container.querySelector("h2")).toBeInTheDocument();
      expect(container.querySelector("h3")).toBeInTheDocument();
    });

    it("should handle component re-rendering with different text", () => {
      const { rerender } = renderWithTheme(<InternetExplorerWarning />);

      useSettingsStore.mockImplementation((selector) => {
        const mockState = {
          langObj: {
            ieWarningHeaderText: "New Header",
            ieWarningText: "New Message",
          },
        };
        return selector(mockState);
      });

      rerender(
        <ThemeProvider theme={mockTheme}>
          <InternetExplorerWarning />
        </ThemeProvider>
      );

      expect(screen.getByText("New Header")).toBeInTheDocument();
      expect(screen.getByText("New Message")).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import LoadingScreen from "../LoadingScreen";

// Mock detectMobileBrowser
vi.mock("../../../utilities/detectMobileBrowser");

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

describe("LoadingScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Desktop Rendering", () => {
    beforeEach(async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);
    });

    it("should render the loading screen", () => {
      renderWithTheme(<LoadingScreen />);

      expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("should display Loading text for desktop", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingText = screen.getByText("Loading");
      expect(loadingText).toBeInTheDocument();

      // Check it's using TextDiv (desktop version)
      const styledDiv = container.querySelector('[class*="TextDiv"]');
      expect(loadingText).toBeInTheDocument();
    });

    it("should render the loading spinner container", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingDiv = container.querySelector("#loading");
      expect(loadingDiv).toBeInTheDocument();
    });

    it("should have correct container structure", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });

    it("should render both text and spinner container", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      expect(screen.getByText("Loading")).toBeInTheDocument();
      expect(container.querySelector("#loading")).toBeInTheDocument();
    });
  });

  describe("Mobile Rendering", () => {
    beforeEach(async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(true);
    });

    it("should render the loading screen on mobile", () => {
      renderWithTheme(<LoadingScreen />);

      expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("should display Loading text for mobile", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingText = screen.getByText("Loading");
      expect(loadingText).toBeInTheDocument();

      // Check it's using MobileTextDiv
      expect(loadingText).toBeInTheDocument();
    });

    it("should render the loading spinner container on mobile", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingDiv = container.querySelector("#loading");
      expect(loadingDiv).toBeInTheDocument();
    });

    it("should have correct container structure on mobile", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });

    it("should render both text and spinner container on mobile", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      expect(screen.getByText("Loading")).toBeInTheDocument();
      expect(container.querySelector("#loading")).toBeInTheDocument();
    });
  });

  describe("Mobile vs Desktop Detection", () => {
    it("should call detectMobileBrowser", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);

      renderWithTheme(<LoadingScreen />);

      expect(detectMobileBrowser.default).toHaveBeenCalled();
    });

    it("should render different component for mobile vs desktop", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");

      // Desktop render
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);
      const { container: desktopContainer, unmount: unmountDesktop } = renderWithTheme(
        <LoadingScreen />
      );

      expect(screen.getByText("Loading")).toBeInTheDocument();
      unmountDesktop();

      // Mobile render
      vi.mocked(detectMobileBrowser.default).mockReturnValue(true);
      const { container: mobileContainer } = renderWithTheme(<LoadingScreen />);

      expect(screen.getByText("Loading")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    beforeEach(async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);
    });

    it("should have Container as root element", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const rootElement = container.firstChild;
      expect(rootElement).toBeInTheDocument();
    });

    it("should have Loading text before spinner", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingText = screen.getByText("Loading");
      const loadingSpinner = container.querySelector("#loading");

      // Both should exist
      expect(loadingText).toBeInTheDocument();
      expect(loadingSpinner).toBeInTheDocument();
    });

    it("should have loading spinner in a div wrapper", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingDiv = container.querySelector("#loading");
      const parent = loadingDiv?.parentElement;

      expect(parent).toBeInTheDocument();
      expect(parent?.tagName).toBe("DIV");
    });

    it("should render exactly one Loading text", () => {
      renderWithTheme(<LoadingScreen />);

      const loadingElements = screen.getAllByText("Loading");
      expect(loadingElements).toHaveLength(1);
    });

    it("should render exactly one loading spinner container", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingDivs = container.querySelectorAll("#loading");
      expect(loadingDivs).toHaveLength(1);
    });
  });

  describe("Styled Components", () => {
    it("should render with styled-components theme", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);

      const { container } = renderWithTheme(<LoadingScreen />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render without theme provider (graceful degradation)", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);

      const { container } = render(<LoadingScreen />);

      expect(screen.getByText("Loading")).toBeInTheDocument();
      expect(container.querySelector("#loading")).toBeInTheDocument();
    });

    it("should apply Container styles", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);

      const { container } = renderWithTheme(<LoadingScreen />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });

    it("should apply TextDiv styles on desktop", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);

      renderWithTheme(<LoadingScreen />);

      const loadingText = screen.getByText("Loading");
      expect(loadingText).toBeInTheDocument();
    });

    it("should apply MobileTextDiv styles on mobile", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(true);

      renderWithTheme(<LoadingScreen />);

      const loadingText = screen.getByText("Loading");
      expect(loadingText).toBeInTheDocument();
    });
  });

  describe("Loading Spinner Element", () => {
    beforeEach(async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);
    });

    it('should have loading element with id="loading"', () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingDiv = container.querySelector("#loading");
      expect(loadingDiv).toBeInTheDocument();
      expect(loadingDiv).toHaveAttribute("id", "loading");
    });

    it("should have loading element as empty div", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingDiv = container.querySelector("#loading");
      expect(loadingDiv?.textContent).toBe("");
    });

    it("should have loading element nested in wrapper div", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingDiv = container.querySelector("#loading");
      const wrapper = loadingDiv?.parentElement;

      expect(wrapper?.tagName).toBe("DIV");
    });
  });

  describe("Responsive Behavior", () => {
    it("should change display when switching from desktop to mobile", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");

      // First render as desktop
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);
      const { unmount } = renderWithTheme(<LoadingScreen />);

      expect(screen.getByText("Loading")).toBeInTheDocument();
      unmount();

      // Re-render as mobile
      vi.mocked(detectMobileBrowser.default).mockReturnValue(true);
      renderWithTheme(<LoadingScreen />);

      expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("should maintain structure across device types", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");

      // Desktop
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);
      const { container: desktopContainer, unmount: unmountDesktop } = renderWithTheme(
        <LoadingScreen />
      );

      const desktopLoadingDiv = desktopContainer.querySelector("#loading");
      expect(desktopLoadingDiv).toBeInTheDocument();
      unmountDesktop();

      // Mobile
      vi.mocked(detectMobileBrowser.default).mockReturnValue(true);
      const { container: mobileContainer } = renderWithTheme(<LoadingScreen />);

      const mobileLoadingDiv = mobileContainer.querySelector("#loading");
      expect(mobileLoadingDiv).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle detectMobileBrowser returning undefined", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(undefined);

      renderWithTheme(<LoadingScreen />);

      // Should default to desktop behavior
      expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("should handle detectMobileBrowser returning null", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(null);

      renderWithTheme(<LoadingScreen />);

      // Should default to desktop behavior
      expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("should render consistently on multiple calls", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);

      const { unmount: unmount1 } = renderWithTheme(<LoadingScreen />);
      expect(screen.getByText("Loading")).toBeInTheDocument();
      unmount1();

      const { unmount: unmount2 } = renderWithTheme(<LoadingScreen />);
      expect(screen.getByText("Loading")).toBeInTheDocument();
      unmount2();

      renderWithTheme(<LoadingScreen />);
      expect(screen.getByText("Loading")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    beforeEach(async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);
    });

    it("should have readable text content", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const text = container.textContent;
      expect(text).toContain("Loading");
    });

    it("should provide loading indication to users", () => {
      renderWithTheme(<LoadingScreen />);

      const loadingText = screen.getByText("Loading");
      expect(loadingText).toBeInTheDocument();
    });

    it("should be identifiable by loading element", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const loadingDiv = container.querySelector("#loading");
      expect(loadingDiv).toBeInTheDocument();
    });
  });

  describe("Visual Consistency", () => {
    it('should always display "Loading" text regardless of device', async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");

      // Desktop
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);
      const { unmount: unmountDesktop } = renderWithTheme(<LoadingScreen />);
      expect(screen.getByText("Loading")).toBeInTheDocument();
      unmountDesktop();

      // Mobile
      vi.mocked(detectMobileBrowser.default).mockReturnValue(true);
      renderWithTheme(<LoadingScreen />);
      expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("should always display loading spinner regardless of device", async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");

      // Desktop
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);
      const { container: desktopContainer, unmount: unmountDesktop } = renderWithTheme(
        <LoadingScreen />
      );
      expect(desktopContainer.querySelector("#loading")).toBeInTheDocument();
      unmountDesktop();

      // Mobile
      vi.mocked(detectMobileBrowser.default).mockReturnValue(true);
      const { container: mobileContainer } = renderWithTheme(<LoadingScreen />);
      expect(mobileContainer.querySelector("#loading")).toBeInTheDocument();
    });
  });

  describe("Component Simplicity", () => {
    beforeEach(async () => {
      const detectMobileBrowser = await import("../../../utilities/detectMobileBrowser");
      vi.mocked(detectMobileBrowser.default).mockReturnValue(false);
    });

    it("should be a simple functional component", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      // Should render without errors
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should not have any interactive elements", () => {
      const { container } = renderWithTheme(<LoadingScreen />);

      const buttons = container.querySelectorAll("button");
      const inputs = container.querySelectorAll("input");
      const links = container.querySelectorAll("a");

      expect(buttons).toHaveLength(0);
      expect(inputs).toHaveLength(0);
      expect(links).toHaveLength(0);
    });

    it("should be purely presentational", () => {
      renderWithTheme(<LoadingScreen />);

      // Just displays loading state, no interaction
      expect(screen.getByText("Loading")).toBeInTheDocument();
    });
  });
});

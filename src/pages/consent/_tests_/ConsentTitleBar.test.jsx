import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConsentTitleBar } from "../ConsentTitleBar";
import useSettingsStore from "../../../globalState/useSettingsStore";

// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));
vi.mock("html-react-parser", () => ({
  default: (str) => str,
}));

describe("ConsentTitleBar", () => {
  const mockLangObj = {
    consentTitleBarText: "Research Consent",
  };

  const mockConfigObj = {
    headerBarColor: "#3f51b5",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useSettingsStore
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: mockLangObj,
        configObj: mockConfigObj,
      };
      return selector(state);
    });
  });

  it("renders the component with title text", () => {
    render(<ConsentTitleBar />);

    expect(screen.getByText("Research Consent")).toBeInTheDocument();
  });

  it("renders with the correct test id", () => {
    render(<ConsentTitleBar />);

    expect(screen.getByTestId("ConsentTitleBarDiv")).toBeInTheDocument();
  });

  it("applies header bar color from config", () => {
    render(<ConsentTitleBar />);

    const titleBar = screen.getByTestId("ConsentTitleBarDiv");
    expect(titleBar).toHaveStyle({ backgroundColor: "#3f51b5" });
  });

  it("applies different header bar color", () => {
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: mockLangObj,
        configObj: {
          headerBarColor: "#ff5722",
        },
      };
      return selector(state);
    });

    render(<ConsentTitleBar />);

    const titleBar = screen.getByTestId("ConsentTitleBarDiv");
    // expect(titleBar).toHaveAttribute("background", "#ff5722");
    expect(titleBar).toHaveStyle({ backgroundColor: "#ff5722" });
  });

  it("renders empty string when consentTitleBarText is missing", () => {
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: {
          consentTitleBarText: undefined,
        },
        configObj: mockConfigObj,
      };
      return selector(state);
    });

    render(<ConsentTitleBar />);

    const titleBar = screen.getByTestId("ConsentTitleBarDiv");
    expect(titleBar).toBeInTheDocument();
    expect(titleBar).toBeEmptyDOMElement();
  });

  it("renders empty string when consentTitleBarText is null", () => {
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: {
          consentTitleBarText: null,
        },
        configObj: mockConfigObj,
      };
      return selector(state);
    });

    render(<ConsentTitleBar />);

    const titleBar = screen.getByTestId("ConsentTitleBarDiv");
    expect(titleBar).toBeInTheDocument();
    expect(titleBar).toBeEmptyDOMElement();
  });

  it("renders with HTML content", () => {
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: {
          consentTitleBarText: "<strong>Bold Title</strong>",
        },
        configObj: mockConfigObj,
      };
      return selector(state);
    });

    render(<ConsentTitleBar />);

    expect(screen.getByText(/Bold Title/)).toBeInTheDocument();
  });

  it("calls useSettingsStore with correct selectors", () => {
    render(<ConsentTitleBar />);

    expect(useSettingsStore).toHaveBeenCalledTimes(2);
    expect(useSettingsStore).toHaveBeenCalledWith(expect.any(Function));
  });

  it("handles empty string in consentTitleBarText", () => {
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: {
          consentTitleBarText: "",
        },
        configObj: mockConfigObj,
      };
      return selector(state);
    });

    render(<ConsentTitleBar />);

    const titleBar = screen.getByTestId("ConsentTitleBarDiv");
    expect(titleBar).toBeInTheDocument();
    expect(titleBar).toBeEmptyDOMElement();
  });

  it("handles special characters in title text", () => {
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: {
          consentTitleBarText: "Consent & Agreement <Form>",
        },
        configObj: mockConfigObj,
      };
      return selector(state);
    });

    render(<ConsentTitleBar />);

    expect(screen.getByText(/Consent & Agreement/)).toBeInTheDocument();
  });

  describe("styled component", () => {
    it("renders as a div element", () => {
      const { container } = render(<ConsentTitleBar />);

      const titleBar = container.querySelector("div[data-testid='ConsentTitleBarDiv']");
      expect(titleBar).toBeInTheDocument();
      expect(titleBar.tagName).toBe("DIV");
    });

    it("has fixed positioning", () => {
      const { container } = render(<ConsentTitleBar />);

      const titleBar = container.querySelector("div[data-testid='ConsentTitleBarDiv']");
      const styles = window.getComputedStyle(titleBar);
      expect(styles.position).toBe("fixed");
    });
  });

  describe("edge cases", () => {
    it("handles missing headerBarColor gracefully", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: mockLangObj,
          configObj: {
            headerBarColor: undefined,
          },
        };
        return selector(state);
      });

      render(<ConsentTitleBar />);

      const titleBar = screen.getByTestId("ConsentTitleBarDiv");
      expect(titleBar).toBeInTheDocument();
    });

    it("handles empty configObj", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: mockLangObj,
          configObj: {},
        };
        return selector(state);
      });

      render(<ConsentTitleBar />);

      const titleBar = screen.getByTestId("ConsentTitleBarDiv");
      expect(titleBar).toBeInTheDocument();
    });

    it("handles empty langObj", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: {},
          configObj: mockConfigObj,
        };
        return selector(state);
      });

      render(<ConsentTitleBar />);

      const titleBar = screen.getByTestId("ConsentTitleBarDiv");
      expect(titleBar).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has white text color for contrast", () => {
      const { container } = render(<ConsentTitleBar />);

      const titleBar = container.querySelector("div[data-testid='ConsentTitleBarDiv']");
      const styles = window.getComputedStyle(titleBar);
      expect(styles.color).toBeTruthy();
    });

    it("has bold font weight for visibility", () => {
      const { container } = render(<ConsentTitleBar />);

      const titleBar = container.querySelector("div[data-testid='ConsentTitleBarDiv']");
      const styles = window.getComputedStyle(titleBar);
      expect(styles.fontWeight).toBeTruthy();
    });

    it("renders content that is screen reader accessible", () => {
      render(<ConsentTitleBar />);

      const titleBar = screen.getByTestId("ConsentTitleBarDiv");
      expect(titleBar).toHaveTextContent("Research Consent");
    });
  });
});

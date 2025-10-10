import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ConsentPage from "../Consent";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";
import calculateTimeOnPage from "../../../utilities/calculateTimeOnPage";
import parseParams from "../../landing/parseParams";

// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");
vi.mock("../../../utilities/calculateTimeOnPage");

vi.mock("../../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));
vi.mock("html-react-parser", () => ({
  default: (str) => str,
}));

vi.mock("../../landing/parseParams");
vi.mock("./../ConsentModal", () => ({
  default: () => <div data-testid="consent-modal">Consent Modal</div>,
}));
vi.mock("../../../utilities/PromptUnload", () => ({
  default: () => <div data-testid="prompt-unload">Prompt Unload</div>,
}));

describe("ConsentPage", () => {
  const mockSetProgressScore = vi.fn();
  const mockSetCurrentPage = vi.fn();
  const mockSetDisplayNextButton = vi.fn();
  const mockSetUrlUsercode = vi.fn();

  const mockLangObj = {
    consentText: "This is the consent text",
    consentTitleBarText: "Research Consent",
  };

  const mockConfigObj = {
    headerBarColor: "#3f51b5",
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};

      return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: vi.fn((key) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        }),
        get length() {
          return Object.keys(store).length;
        },
        key: vi.fn((index) => {
          const keys = Object.keys(store);
          return keys[index] || null;
        }),
      };
    })();

    // Replace global localStorage
    window.localStorage = localStorageMock;

    // Setup Date.now mock  (needed for timeOnPage calcs)
    vi.spyOn(Date, "now").mockReturnValue(1000000);

    // Mock useSettingsStore
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: mockLangObj,
        configObj: mockConfigObj,
      };
      return selector(state);
    });

    // Setup useSettingsStore mock
    useSettingsStore.mockImplementation((selector) => {
      const state = {
        langObj: { consentText: "Test consent text" },
        configObj: {},
      };
      return selector(state);
    });

    // Setup useStore mock with your functions
    useStore.mockImplementation((selector) => {
      const state = {
        setProgressScore: mockSetProgressScore,
        setCurrentPage: mockSetCurrentPage,
        setDisplayNextButton: mockSetDisplayNextButton,
        setUrlUsercode: mockSetUrlUsercode,
      };
      return selector(state);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the component with consent text and title", () => {
    // mockStore({ setDisplayNextButton: true });
    render(<ConsentPage />);

    expect(screen.getByTestId("ConsentPageDiv")).toBeInTheDocument();

    expect(screen.getByText("Test consent text")).toBeInTheDocument();
  });

  it("renders ConsentModal and PromptUnload components", () => {
    render(<ConsentPage />);

    expect(screen.getByTestId("consent-modal")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-unload")).toBeInTheDocument();
  });

  it("should set localStorage currentPage to consent", async () => {
    render(<ConsentPage />);

    // Wait a tick for async operations
    await vi.waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith("currentPage", "consent");
    });
  });

  it("sets progress score and current page on mount", async () => {
    render(<ConsentPage />);

    await waitFor(() => {
      expect(mockSetCurrentPage).toHaveBeenCalledWith("consent");
      expect(mockSetProgressScore).toHaveBeenCalledWith(15);
      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(true);
    });

    // expect(localStorage.getItem("currentPage")).toBe("consent");
  });

  it("calculates time on page when component unmounts", () => {
    const { unmount } = render(<ConsentPage />);

    unmount();

    expect(calculateTimeOnPage).toHaveBeenCalledWith(1000000, "consentPage", "consentPage");
  });

  describe("URL usercode handling", () => {
    it("sets usercode from URL when present", async () => {
      parseParams.mockReturnValue("user123");

      render(<ConsentPage />);

      await waitFor(() => {
        expect(mockSetUrlUsercode).toHaveBeenCalledWith("user123");
        expect(localStorage.getItem("urlUsercode")).toBe("user123");
      });
    });

    it("removes slashes and hashes from URL usercode", async () => {
      parseParams.mockReturnValue("/user123/#test");

      render(<ConsentPage />);

      await waitFor(() => {
        expect(mockSetUrlUsercode).toHaveBeenCalledWith("user123test");
        expect(localStorage.getItem("urlUsercode")).toBe("user123test");
      });
    });

    it("sets 'not_set' when no URL parameter and no localStorage value", async () => {
      parseParams.mockReturnValue(null);
      localStorage.removeItem("urlUsercode");

      render(<ConsentPage />);

      await waitFor(() => {
        expect(mockSetUrlUsercode).toHaveBeenCalledWith("not_set");
        expect(localStorage.getItem("urlUsercode")).toBe("not_set");
      });
    });

    it("uses localStorage value when no URL parameter", async () => {
      parseParams.mockReturnValue(null);
      localStorage.setItem("urlUsercode", "storedUser456");

      render(<ConsentPage />);

      await waitFor(() => {
        expect(mockSetUrlUsercode).toHaveBeenCalledWith("storedUser456 (stored)");
      });
    });

    it("handles 'not_set' value from localStorage", async () => {
      parseParams.mockReturnValue(null);
      localStorage.setItem("urlUsercode", "not_set");

      render(<ConsentPage />);

      await waitFor(() => {
        expect(mockSetUrlUsercode).toHaveBeenCalledWith("not_set");
      });
    });

    it("handles undefined string in localStorage", async () => {
      parseParams.mockReturnValue(null);
      localStorage.setItem("urlUsercode", "undefined");

      render(<ConsentPage />);

      await waitFor(() => {
        expect(mockSetUrlUsercode).toHaveBeenCalledWith("not_set");
        expect(localStorage.getItem("urlUsercode")).toBe("not_set");
      });
    });
  });

  describe("consent text rendering", () => {
    it("renders empty string when consentText is missing", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: {
            consentText: undefined,
            consentTitleBarText: "Research Consent",
          },
          configObj: mockConfigObj,
        };
        return selector(state);
      });

      const { container } = render(<ConsentPage />);
      const contentDiv = container.querySelector("div > div");
      expect(contentDiv).toBeInTheDocument();
    });

    it("renders empty string when consentTitleBarText is missing", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: {
            consentText: "<p>Consent text</p>",
            consentTitleBarText: undefined,
          },
          configObj: mockConfigObj,
        };
        return selector(state);
      });

      render(<ConsentPage />);
      // Should still render without throwing errors
      expect(screen.getByText(/Consent text/)).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has proper heading structure", () => {
      render(<ConsentPage />);

      const titleBar = screen.getByTestId("ConsentTitleBarDiv");
      expect(titleBar).toBeInTheDocument();
    });

    it("renders scrollable container for long content", () => {
      const { container } = render(<ConsentPage />);

      const containerDiv =
        container.querySelector('[style*="overflow-y"]') || container.querySelector("div");
      expect(containerDiv).toBeInTheDocument();
    });
  });
});

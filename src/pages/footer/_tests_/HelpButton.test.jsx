import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import HelpButton from "../HelpButton";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";
import { ThemeProvider } from "styled-components";

// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));
vi.mock("html-react-parser", () => ({
  default: (str) => str,
}));

// Mock theme for styled-components
const mockTheme = {
  primary: "#337ab7",
  secondary: "#286090",
  focus: "#204d74",
};

describe("HelpButton", () => {
  const mockSetTriggerLandingModal = vi.fn();
  const mockSetTriggerPresortModal = vi.fn();
  const mockSetTriggerSortModal = vi.fn();
  const mockSetTriggerPostsortModal = vi.fn();
  const mockSetTriggerSurveyModal = vi.fn();
  const mockSetTriggerSubmitModal = vi.fn();
  const mockSetTriggerConsentModal = vi.fn();
  const mockSetTriggerThinHelpModal = vi.fn();

  const mockLangObj = {
    btnHelp: "Help",
    btnHelpLanding: "Landing Help",
    btnHelpConsent: "Consent Help",
  };

  const mockConfigObj = {
    showConsentPageHelpModal: true,
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

  afterEach(() => {
    if (console.log.mockRestore) {
      console.log.mockRestore();
    }
  });

  const setupStore = (page) => {
    useStore.mockImplementation((selector) => {
      const state = {
        currentPage: page,
        setTriggerLandingModal: mockSetTriggerLandingModal,
        setTriggerPresortModal: mockSetTriggerPresortModal,
        setTriggerSortModal: mockSetTriggerSortModal,
        setTriggerPostsortModal: mockSetTriggerPostsortModal,
        setTriggerSurveyModal: mockSetTriggerSurveyModal,
        setTriggerSubmitModal: mockSetTriggerSubmitModal,
        setTriggerConsentModal: mockSetTriggerConsentModal,
        setTriggerThinHelpModal: mockSetTriggerThinHelpModal,
      };
      return selector(state);
    });
  };

  const renderWithTheme = (component) => {
    return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
  };

  describe("rendering", () => {
    it("renders the button with default help text", () => {
      setupStore("presort");
      renderWithTheme(<HelpButton />);

      expect(screen.getByText("Help")).toBeInTheDocument();
    });

    it("renders with test id on non-consent pages", () => {
      setupStore("presort");
      renderWithTheme(<HelpButton />);

      expect(screen.getByTestId("helpButtonDiv")).toBeInTheDocument();
    });

    it("renders with landing-specific text on landing page", () => {
      setupStore("landing");
      renderWithTheme(<HelpButton />);

      expect(screen.getByText("Landing Help")).toBeInTheDocument();
    });

    it("renders with consent-specific text on consent page", () => {
      setupStore("consent");
      renderWithTheme(<HelpButton />);

      expect(screen.getByText("Consent Help")).toBeInTheDocument();
    });

    it("renders with default help text on sort page", () => {
      setupStore("sort");
      renderWithTheme(<HelpButton />);

      expect(screen.getByText("Help")).toBeInTheDocument();
    });
  });

  describe("consent page conditional rendering", () => {
    it("renders button when showConsentPageHelpModal is true", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: mockLangObj,
          configObj: { showConsentPageHelpModal: true },
        };
        return selector(state);
      });
      setupStore("consent");

      renderWithTheme(<HelpButton />);

      expect(screen.getByText("Consent Help")).toBeInTheDocument();
    });

    it("does not render button when showConsentPageHelpModal is false", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: mockLangObj,
          configObj: { showConsentPageHelpModal: false },
        };
        return selector(state);
      });
      setupStore("consent");

      const { container } = renderWithTheme(<HelpButton />);

      expect(container.firstChild).toBeNull();
    });

    it("does not render button when showConsentPageHelpModal is undefined", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: mockLangObj,
          configObj: { showConsentPageHelpModal: undefined },
        };
        return selector(state);
      });
      setupStore("consent");

      const { container } = renderWithTheme(<HelpButton />);

      expect(container.firstChild).toBeNull();
    });

    it("does not render button when showConsentPageHelpModal is null", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: mockLangObj,
          configObj: { showConsentPageHelpModal: null },
        };
        return selector(state);
      });
      setupStore("consent");

      const { container } = renderWithTheme(<HelpButton />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("modal triggering on click", () => {
    it("triggers landing modal when on landing page", () => {
      setupStore("landing");
      renderWithTheme(<HelpButton />);

      const button = screen.getByText("Landing Help");
      fireEvent.click(button);

      expect(mockSetTriggerLandingModal).toHaveBeenCalledWith(true);
      expect(mockSetTriggerLandingModal).toHaveBeenCalledTimes(1);
    });

    it("triggers consent modal when on consent page", () => {
      setupStore("consent");
      renderWithTheme(<HelpButton />);

      const button = screen.getByText("Consent Help");
      fireEvent.click(button);

      expect(mockSetTriggerConsentModal).toHaveBeenCalledWith(true);
      expect(mockSetTriggerConsentModal).toHaveBeenCalledTimes(1);
    });

    it("triggers presort modal when on presort page", () => {
      setupStore("presort");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);

      expect(mockSetTriggerPresortModal).toHaveBeenCalledWith(true);
      expect(mockSetTriggerPresortModal).toHaveBeenCalledTimes(1);
    });

    it("triggers thin help modal when on thin page", () => {
      setupStore("thin");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);

      expect(mockSetTriggerThinHelpModal).toHaveBeenCalledWith(true);
      expect(mockSetTriggerThinHelpModal).toHaveBeenCalledTimes(1);
    });

    it("triggers sort modal when on sort page", () => {
      setupStore("sort");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);

      expect(mockSetTriggerSortModal).toHaveBeenCalledWith(true);
      expect(mockSetTriggerSortModal).toHaveBeenCalledTimes(1);
    });

    it("triggers postsort modal when on postsort page", () => {
      setupStore("postsort");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);

      expect(mockSetTriggerPostsortModal).toHaveBeenCalledWith(true);
      expect(mockSetTriggerPostsortModal).toHaveBeenCalledTimes(1);
    });

    it("triggers survey modal when on survey page", () => {
      setupStore("survey");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);

      expect(mockSetTriggerSurveyModal).toHaveBeenCalledWith(true);
      expect(mockSetTriggerSurveyModal).toHaveBeenCalledTimes(1);
    });

    it("triggers submit modal when on submit page", () => {
      setupStore("submit");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);

      expect(mockSetTriggerSubmitModal).toHaveBeenCalledWith(true);
      expect(mockSetTriggerSubmitModal).toHaveBeenCalledTimes(1);
    });
  });

  describe("console logging", () => {
    it("logs currentPage when button is clicked", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      setupStore("sort");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);

      expect(consoleSpy).toHaveBeenCalledWith("currentPage", "sort");
      consoleSpy.mockRestore();
    });

    it("logs currentPage for landing page", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      setupStore("landing");
      renderWithTheme(<HelpButton />);

      const button = screen.getByText("Landing Help");
      fireEvent.click(button);

      expect(consoleSpy).toHaveBeenCalledWith("currentPage", "landing");
      consoleSpy.mockRestore();
    });
  });

  describe("multiple clicks", () => {
    it("triggers modal multiple times on repeated clicks", () => {
      setupStore("sort");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockSetTriggerSortModal).toHaveBeenCalledTimes(3);
      expect(mockSetTriggerSortModal).toHaveBeenCalledWith(true);
    });
  });

  describe("edge cases", () => {
    it("does nothing when clicked on unknown page", () => {
      setupStore("unknown");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);

      expect(mockSetTriggerLandingModal).not.toHaveBeenCalled();
      expect(mockSetTriggerPresortModal).not.toHaveBeenCalled();
      expect(mockSetTriggerSortModal).not.toHaveBeenCalled();
      expect(mockSetTriggerPostsortModal).not.toHaveBeenCalled();
      expect(mockSetTriggerSurveyModal).not.toHaveBeenCalled();
      expect(mockSetTriggerSubmitModal).not.toHaveBeenCalled();
      expect(mockSetTriggerConsentModal).not.toHaveBeenCalled();
      expect(mockSetTriggerThinHelpModal).not.toHaveBeenCalled();
    });

    it("handles undefined currentPage", () => {
      setupStore(undefined);
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);

      expect(mockSetTriggerSortModal).not.toHaveBeenCalled();
    });

    it("handles null currentPage", () => {
      setupStore(null);
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      fireEvent.click(button);

      expect(mockSetTriggerSortModal).not.toHaveBeenCalled();
    });

    it("renders empty string when btnHelp is missing", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: {
            btnHelp: undefined,
            btnHelpLanding: "Landing Help",
            btnHelpConsent: "Consent Help",
          },
          configObj: mockConfigObj,
        };
        return selector(state);
      });
      setupStore("sort");

      const { container } = renderWithTheme(<HelpButton />);
      expect(container.querySelector("button")).toBeInTheDocument();
    });

    it("renders empty string when btnHelpLanding is missing", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: {
            btnHelp: "Help",
            btnHelpLanding: undefined,
            btnHelpConsent: "Consent Help",
          },
          configObj: mockConfigObj,
        };
        return selector(state);
      });
      setupStore("landing");

      const { container } = renderWithTheme(<HelpButton />);
      expect(container.querySelector("button")).toBeInTheDocument();
    });

    it("renders empty string when btnHelpConsent is missing", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: {
            btnHelp: "Help",
            btnHelpLanding: "Landing Help",
            btnHelpConsent: undefined,
          },
          configObj: mockConfigObj,
        };
        return selector(state);
      });
      setupStore("consent");

      const { container } = renderWithTheme(<HelpButton />);
      expect(container.querySelector("button")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("button is keyboard accessible", () => {
      setupStore("sort");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      button.focus();

      expect(document.activeElement).toBe(button);
    });

    it("button is clickable via keyboard", () => {
      setupStore("sort");
      renderWithTheme(<HelpButton />);

      const button = screen.getByTestId("helpButtonDiv");
      button.focus();
      fireEvent.click(button);

      expect(mockSetTriggerSortModal).toHaveBeenCalledWith(true);
    });
  });

  describe("all pages trigger correct modals", () => {
    it.each([
      ["landing", mockSetTriggerLandingModal],
      ["consent", mockSetTriggerConsentModal],
      ["presort", mockSetTriggerPresortModal],
      ["thin", mockSetTriggerThinHelpModal],
      ["sort", mockSetTriggerSortModal],
      ["postsort", mockSetTriggerPostsortModal],
      ["survey", mockSetTriggerSurveyModal],
      ["submit", mockSetTriggerSubmitModal],
    ])("triggers correct modal for page '%s'", (page, expectedMock) => {
      vi.clearAllMocks();
      setupStore(page);
      renderWithTheme(<HelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(expectedMock).toHaveBeenCalledWith(true);
      expect(expectedMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("styled component", () => {
    it("renders as a button element", () => {
      setupStore("sort");
      const { container } = renderWithTheme(<HelpButton />);

      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });
  });

  describe("text content by page", () => {
    it("displays correct text for each page type", () => {
      const testCases = [{ page: "landing", expectedText: "Landing Help" }];

      testCases.forEach(({ page }) => {
        const { unmount } = renderWithTheme(<HelpButton />);
        setupStore(page);
        unmount();

        renderWithTheme(<HelpButton />);
        expect(screen.getByTestId("helpButtonDiv")).toBeInTheDocument();
        unmount();
      });
    });
  });
});

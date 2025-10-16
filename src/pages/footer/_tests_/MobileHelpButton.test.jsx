import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import MobileHelpButton from "../MobileHelpButton";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((text) => text),
}));
vi.mock("html-react-parser", () => ({
  default: vi.fn((text) => text),
}));

// Mock theme for styled-components
const mockTheme = {
  primary: "#337ab7",
  secondary: "#286090",
  focus: "#204d74",
};

// Helper to render with theme
const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe("MobileHelpButton", () => {
  let mockSetTriggerLandingModal;
  let mockSetTriggerSortModal;
  let mockSetTriggerPostsortModal;
  let mockSetTriggerSurveyModal;
  let mockSetTriggerSubmitModal;
  let mockSetTriggerConsentModal;
  let mockSetTriggerMobilePresortHelpModal;
  let consoleLogSpy;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Spy on console.log
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Setup mock functions
    mockSetTriggerLandingModal = vi.fn();
    mockSetTriggerSortModal = vi.fn();
    mockSetTriggerPostsortModal = vi.fn();
    mockSetTriggerSurveyModal = vi.fn();
    mockSetTriggerSubmitModal = vi.fn();
    mockSetTriggerConsentModal = vi.fn();
    mockSetTriggerMobilePresortHelpModal = vi.fn();

    // Mock useSettingsStore
    useSettingsStore.mockReturnValue({
      langObj: {
        btnHelp: "Help",
        btnHelpLanding: "Landing Help",
        btnHelpConsent: "Consent Help",
      },
      configObj: {
        showConsentPageHelpModal: true,
      },
    });

    // Mock useStore with default values
    useStore.mockImplementation((selector) => {
      const mockState = {
        currentPage: "landing",
        setTriggerLandingModal: mockSetTriggerLandingModal,
        setTriggerSortModal: mockSetTriggerSortModal,
        setTriggerPostsortModal: mockSetTriggerPostsortModal,
        setTriggerSurveyModal: mockSetTriggerSurveyModal,
        setTriggerSubmitModal: mockSetTriggerSubmitModal,
        setTriggerConsentModal: mockSetTriggerConsentModal,
        setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
      };
      return selector(mockState);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleLogSpy.mockRestore();
  });

  describe("Rendering", () => {
    it("should render the help button with default text", async () => {
      renderWithTheme(<MobileHelpButton />);

      await expect(screen.getByTestId("helpButton2")).toBeInTheDocument();
    });

    // it("should render with correct tabindex attribute", () => {
    //   renderWithTheme(<MobileHelpButton />);

    //   const button = screen.getByTestId("helpButton1");
    //   expect(button).toHaveAttribute("tabindex", "0");
    // });
  });

  /*
  describe("Button Text by Page", () => {
    it("should display landing help text when on landing page", () => {
      renderWithTheme(<MobileHelpButton />);

      expect(screen.getByText("Landing Help")).toBeInTheDocument();
    });

    it("should display consent help text when on consent page", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "consent",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<MobileHelpButton />);

      expect(screen.getByText("Consent Help")).toBeInTheDocument();
    });

    it("should display default help text when on presort page", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "presort",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<MobileHelpButton />);

      expect(screen.getByText("Help")).toBeInTheDocument();
    });

    it("should display default help text when on sort page", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "sort",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<MobileHelpButton />);

      expect(screen.getByText("Help")).toBeInTheDocument();
    });
  });

  describe("Landing Page Modal Trigger", () => {
    it("should trigger landing modal when clicked on landing page", () => {
      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerLandingModal).toHaveBeenCalledWith(true);
      expect(consoleLogSpy).toHaveBeenCalledWith("currentPage", "landing");
    });

    it("should not trigger other modals when on landing page", () => {
      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerConsentModal).not.toHaveBeenCalled();
      expect(mockSetTriggerMobilePresortHelpModal).not.toHaveBeenCalled();
      expect(mockSetTriggerSortModal).not.toHaveBeenCalled();
      expect(mockSetTriggerPostsortModal).not.toHaveBeenCalled();
      expect(mockSetTriggerSurveyModal).not.toHaveBeenCalled();
      expect(mockSetTriggerSubmitModal).not.toHaveBeenCalled();
    });
  });

  describe("Consent Page Modal Trigger", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "consent",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });
    });

    it("should trigger consent modal when clicked on consent page", () => {
      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerConsentModal).toHaveBeenCalledWith(true);
      expect(consoleLogSpy).toHaveBeenCalledWith("currentPage", "consent");
    });

    it("should render button when showConsentPageHelpModal is true", () => {
      renderWithTheme(<MobileHelpButton />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should not render button when showConsentPageHelpModal is false", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          btnHelp: "Help",
          btnHelpLanding: "Landing Help",
          btnHelpConsent: "Consent Help",
        },
        configObj: {
          showConsentPageHelpModal: false,
        },
      });

      const { container } = renderWithTheme(<MobileHelpButton />);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Presort Page Modal Trigger", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "presort",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });
    });

    it("should trigger mobile presort help modal when clicked on presort page", () => {
      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerMobilePresortHelpModal).toHaveBeenCalledWith(true);
      expect(consoleLogSpy).toHaveBeenCalledWith("currentPage", "presort");
      expect(consoleLogSpy).toHaveBeenCalledWith("presort");
    });
  });

  describe("Sort Page Modal Trigger", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "sort",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });
    });

    it("should trigger sort modal when clicked on sort page", () => {
      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerSortModal).toHaveBeenCalledWith(true);
      expect(consoleLogSpy).toHaveBeenCalledWith("currentPage", "sort");
    });
  });

  describe("Postsort Page Modal Trigger", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "postsort",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });
    });

    it("should trigger postsort modal when clicked on postsort page", () => {
      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerPostsortModal).toHaveBeenCalledWith(true);
      expect(consoleLogSpy).toHaveBeenCalledWith("currentPage", "postsort");
    });
  });

  describe("Survey Page Modal Trigger", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "survey",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });
    });

    it("should trigger survey modal when clicked on survey page", () => {
      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerSurveyModal).toHaveBeenCalledWith(true);
      expect(consoleLogSpy).toHaveBeenCalledWith("currentPage", "survey");
    });
  });

  describe("Submit Page Modal Trigger", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "submit",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });
    });

    it("should trigger submit modal when clicked on submit page", () => {
      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerSubmitModal).toHaveBeenCalledWith(true);
      expect(consoleLogSpy).toHaveBeenCalledWith("currentPage", "submit");
    });
  });

  describe("Localization", () => {
    it("should handle empty or null button text gracefully", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          btnHelp: null,
          btnHelpLanding: null,
          btnHelpConsent: null,
        },
        configObj: {
          showConsentPageHelpModal: true,
        },
      });

      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should display localized text from langObj", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          btnHelp: "Ayuda",
          btnHelpLanding: "Ayuda de Inicio",
          btnHelpConsent: "Ayuda de Consentimiento",
        },
        configObj: {
          showConsentPageHelpModal: true,
        },
      });

      renderWithTheme(<MobileHelpButton />);

      expect(screen.getByText("Ayuda de Inicio")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should not trigger any modal for unknown page", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "unknownPage",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });

      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerLandingModal).not.toHaveBeenCalled();
      expect(mockSetTriggerConsentModal).not.toHaveBeenCalled();
      expect(mockSetTriggerMobilePresortHelpModal).not.toHaveBeenCalled();
      expect(mockSetTriggerSortModal).not.toHaveBeenCalled();
      expect(mockSetTriggerPostsortModal).not.toHaveBeenCalled();
      expect(mockSetTriggerSurveyModal).not.toHaveBeenCalled();
      expect(mockSetTriggerSubmitModal).not.toHaveBeenCalled();
    });

    it("should handle multiple rapid clicks", () => {
      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockSetTriggerLandingModal).toHaveBeenCalledTimes(3);
      expect(mockSetTriggerLandingModal).toHaveBeenCalledWith(true);
    });

    it("should handle keyboard interaction (Enter key)", () => {
      renderWithTheme(<MobileHelpButton />);

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

      // Button click should be handled by default button behavior
      expect(button).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering - Consent Page", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "consent",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });
    });

    it("should return null when on consent page and showConsentPageHelpModal is false", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          btnHelp: "Help",
          btnHelpLanding: "Landing Help",
          btnHelpConsent: "Consent Help",
        },
        configObj: {
          showConsentPageHelpModal: false,
        },
      });

      const { container } = renderWithTheme(<MobileHelpButton />);

      expect(container.firstChild).toBeNull();
    });

    it("should render when on consent page and showConsentPageHelpModal is true", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          btnHelp: "Help",
          btnHelpLanding: "Landing Help",
          btnHelpConsent: "Consent Help",
        },
        configObj: {
          showConsentPageHelpModal: true,
        },
      });

      renderWithTheme(<MobileHelpButton />);

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Consent Help")).toBeInTheDocument();
    });

    it("should always render on non-consent pages regardless of config", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          currentPage: "landing",
          setTriggerLandingModal: mockSetTriggerLandingModal,
          setTriggerSortModal: mockSetTriggerSortModal,
          setTriggerPostsortModal: mockSetTriggerPostsortModal,
          setTriggerSurveyModal: mockSetTriggerSurveyModal,
          setTriggerSubmitModal: mockSetTriggerSubmitModal,
          setTriggerConsentModal: mockSetTriggerConsentModal,
          setTriggerMobilePresortHelpModal: mockSetTriggerMobilePresortHelpModal,
        };
        return selector(mockState);
      });

      useSettingsStore.mockReturnValue({
        langObj: {
          btnHelp: "Help",
          btnHelpLanding: "Landing Help",
          btnHelpConsent: "Consent Help",
        },
        configObj: {
          showConsentPageHelpModal: false,
        },
      });

      renderWithTheme(<MobileHelpButton />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
  */
});

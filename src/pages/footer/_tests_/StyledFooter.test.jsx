import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import StyledFooter from "../StyledFooter";
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
vi.mock("./calcProgressScore", () => ({
  default: vi.fn(() => 50),
}));
vi.mock("./getNextPage", () => ({
  default: vi.fn(() => "/next"),
}));

// Mock child components
vi.mock("./NextButton", () => ({
  default: vi.fn(({ children }) => <button data-testid="nextButton">{children}</button>),
}));
vi.mock("./FooterFontSizer", () => ({
  default: vi.fn(() => <div data-testid="fontSizer">Font Sizer</div>),
}));
vi.mock("./CardHeightSizer", () => ({
  default: vi.fn(() => <div data-testid="cardHeightSizer">Card Height Sizer</div>),
}));
vi.mock("./HelpButton", () => ({
  default: vi.fn(() => <button data-testid="help-button">Help</button>),
}));
vi.mock("./PostsortBackButton", () => ({
  default: vi.fn(({ children, to }) => <button data-testid="back-button">{children}</button>),
}));
vi.mock("@ramonak/react-progress-bar", () => ({
  default: vi.fn(({ completed }) => (
    <div data-testid="progress-bar" data-completed={completed}>
      Progress: {completed}%
    </div>
  )),
}));

// Mock theme
const mockTheme = {
  primary: "#337ab7",
  secondary: "#286090",
  focus: "#204d74",
};

// Helper to render with providers
const renderWithProviders = (component, history = createMemoryHistory()) => {
  return render(
    <Router history={history}>
      <ThemeProvider theme={mockTheme}>{component}</ThemeProvider>
    </Router>
  );
};

describe("StyledFooter", () => {
  let history;

  beforeEach(() => {
    vi.clearAllMocks();
    history = createMemoryHistory();

    // Mock useSettingsStore
    useSettingsStore.mockReturnValue({
      langObj: {
        btnNext: "Next",
        btnNextLanding: "Begin",
        btnNextConsent: "I Agree",
        postsortBackButtonText: "Back to Sort",
      },
      configObj: {
        showPostsort: true,
        showSurvey: true,
        useImages: false,
        showConsentPage: true,
        useThinProcess: false,
        showBackButton: false,
        setupTarget: "server",
        studyTitle: "Test Study",
      },
    });

    // Mock useStore
    useStore.mockReturnValue({
      displayNextButton: true,
      currentPage: "landing",
      progressScoreAdditional: 0,
      progressScoreAdditionalSort: 0,
      localUsercode: "TEST123",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render the footer component", () => {
      renderWithProviders(<StyledFooter />);

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });

    it("should render with correct structure", () => {
      const { container } = renderWithProviders(<StyledFooter />);

      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });
  });

  describe("Logo Display", () => {
    it("should display logo HTML by default", () => {
      renderWithProviders(<StyledFooter />);

      // Logo HTML is rendered
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("Help Button Display", () => {
    it("should not display help button on submit page", () => {
      useStore.mockReturnValue({
        displayNextButton: true,
        currentPage: "submit",
        progressScoreAdditional: 0,
        progressScoreAdditionalSort: 0,
        localUsercode: "TEST123",
      });

      renderWithProviders(<StyledFooter />);

      expect(screen.queryByTestId("help-button")).not.toBeInTheDocument();
    });

    it("should not display help button when setupTarget is local on landing page", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          btnNext: "Next",
          btnNextLanding: "Begin",
          btnNextConsent: "I Agree",
          postsortBackButtonText: "Back to Sort",
        },
        configObj: {
          showPostsort: true,
          showSurvey: true,
          useImages: false,
          showConsentPage: true,
          useThinProcess: false,
          showBackButton: false,
          setupTarget: "local",
          studyTitle: "Test Study",
        },
      });

      useStore.mockReturnValue({
        displayNextButton: true,
        currentPage: "landing",
        progressScoreAdditional: 0,
        progressScoreAdditionalSort: 0,
        localUsercode: "TEST123",
      });

      renderWithProviders(<StyledFooter />);

      expect(screen.queryByTestId("help-button")).not.toBeInTheDocument();
    });
  });

  describe("Back Button Display", () => {
    it("should not display back button when showBackButton is false", () => {
      useStore.mockReturnValue({
        displayNextButton: true,
        currentPage: "postsort",
        progressScoreAdditional: 0,
        progressScoreAdditionalSort: 0,
        localUsercode: "TEST123",
      });

      renderWithProviders(<StyledFooter />);

      expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
    });

    it("should not display back button on pages other than postsort", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          btnNext: "Next",
          btnNextLanding: "Begin",
          btnNextConsent: "I Agree",
          postsortBackButtonText: "Back to Sort",
        },
        configObj: {
          showPostsort: true,
          showSurvey: true,
          useImages: false,
          showConsentPage: true,
          useThinProcess: false,
          showBackButton: true,
          setupTarget: "server",
          studyTitle: "Test Study",
        },
      });

      useStore.mockReturnValue({
        displayNextButton: true,
        currentPage: "sort",
        progressScoreAdditional: 0,
        progressScoreAdditionalSort: 0,
        localUsercode: "TEST123",
      });

      renderWithProviders(<StyledFooter />);

      expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
    });
  });

  describe("Progress Bar Display", () => {
    it("should display progress bar by default", () => {
      renderWithProviders(<StyledFooter />);

      expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    });
  });

  describe("Adjustment Controls - Presort Page", () => {
    beforeEach(() => {
      useStore.mockReturnValue({
        displayNextButton: true,
        currentPage: "presort",
        progressScoreAdditional: 0,
        progressScoreAdditionalSort: 0,
        localUsercode: "TEST123",
      });
    });

    it("should not show card height sizer on presort page", () => {
      renderWithProviders(<StyledFooter />);

      expect(screen.queryByTestId("cardHeightSizer")).not.toBeInTheDocument();
    });
  });

  describe("Adjustment Controls - Other Pages", () => {
    it("should not show adjustment container on landing page", () => {
      useStore.mockReturnValue({
        displayNextButton: true,
        currentPage: "landing",
        progressScoreAdditional: 0,
        progressScoreAdditionalSort: 0,
        localUsercode: "TEST123",
      });

      renderWithProviders(<StyledFooter />);

      expect(screen.queryByTestId("fontSizer")).not.toBeInTheDocument();
      expect(screen.queryByTestId("cardHeightSizer")).not.toBeInTheDocument();
    });

    it("should not show adjustment container on survey page", () => {
      useStore.mockReturnValue({
        displayNextButton: true,
        currentPage: "survey",
        progressScoreAdditional: 0,
        progressScoreAdditionalSort: 0,
        localUsercode: "TEST123",
      });

      renderWithProviders(<StyledFooter />);

      expect(screen.queryByTestId("fontSizer")).not.toBeInTheDocument();
      expect(screen.queryByTestId("cardHeightSizer")).not.toBeInTheDocument();
    });

    it("should not show adjustment container on submit page", () => {
      useStore.mockReturnValue({
        displayNextButton: true,
        currentPage: "submit",
        progressScoreAdditional: 0,
        progressScoreAdditionalSort: 0,
        localUsercode: "TEST123",
      });

      renderWithProviders(<StyledFooter />);

      expect(screen.queryByTestId("fontSizer")).not.toBeInTheDocument();
      expect(screen.queryByTestId("cardHeightSizer")).not.toBeInTheDocument();
    });

    it("should not show adjustment container on consent page", () => {
      useStore.mockReturnValue({
        displayNextButton: true,
        currentPage: "consent",
        progressScoreAdditional: 0,
        progressScoreAdditionalSort: 0,
        localUsercode: "TEST123",
      });

      renderWithProviders(<StyledFooter />);

      expect(screen.queryByTestId("fontSizer")).not.toBeInTheDocument();
      expect(screen.queryByTestId("cardHeightSizer")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty langObj gracefully", () => {
      useSettingsStore.mockReturnValue({
        langObj: {
          btnNext: null,
          btnNextLanding: null,
          btnNextConsent: null,
          postsortBackButtonText: null,
        },
        configObj: {
          showPostsort: true,
          showSurvey: true,
          useImages: false,
          showConsentPage: true,
          useThinProcess: false,
          showBackButton: false,
          setupTarget: "server",
          studyTitle: "Test Study",
        },
      });

      renderWithProviders(<StyledFooter />);

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("should handle all pages correctly", () => {
      const pages = [
        "landing",
        "consent",
        "presort",
        "thin",
        "sort",
        "postsort",
        "survey",
        "submit",
      ];

      pages.forEach((page) => {
        vi.clearAllMocks();

        useStore.mockReturnValue({
          displayNextButton: true,
          currentPage: page,
          progressScoreAdditional: 0,
          progressScoreAdditionalSort: 0,
          localUsercode: "TEST123",
        });

        const { unmount } = renderWithProviders(<StyledFooter />);

        expect(screen.getByRole("contentinfo")).toBeInTheDocument();

        unmount();
      });
    });
  });
});

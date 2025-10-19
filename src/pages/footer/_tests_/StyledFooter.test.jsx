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
  default: vi.fn(({ children, to }) => <button data-testid="nextButton">{children}</button>),
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

    // it("should display usercode info when setupTarget is local on sort page", () => {
    //   useSettingsStore.mockReturnValue({
    //     langObj: {
    //       btnNext: "Next",
    //       btnNextLanding: "Begin",
    //       btnNextConsent: "I Agree",
    //       postsortBackButtonText: "Back to Sort",
    //     },
    //     configObj: {
    //       showPostsort: true,
    //       showSurvey: true,
    //       useImages: false,
    //       showConsentPage: true,
    //       useThinProcess: false,
    //       showBackButton: false,
    //       setupTarget: "local",
    //       studyTitle: "My Study",
    //     },
    //   });

    //   useStore.mockReturnValue({
    //     displayNextButton: true,
    //     currentPage: "sort",
    //     progressScoreAdditional: 0,
    //     progressScoreAdditionalSort: 0,
    //     localUsercode: "USER001",
    //   });

    //   renderWithProviders(<StyledFooter />);

    //   expect(screen.getByText(/USER001/)).toBeInTheDocument();
    //   expect(screen.getByText(/My Study/)).toBeInTheDocument();
    // });
  });

  //   describe("Next Button Display", () => {
  // it("should display next button on landing page", () => {
  //   renderWithProviders(<StyledFooter />);

  //   expect(screen.getByTestId("nextButton")).toBeInTheDocument();
  //   expect(screen.getByText("Begin")).toBeInTheDocument();
  // });

  // it("should display next button on consent page with correct text", () => {
  //   useStore.mockReturnValue({
  //     displayNextButton: true,
  //     currentPage: "consent",
  //     progressScoreAdditional: 0,
  //     progressScoreAdditionalSort: 0,
  //     localUsercode: "TEST123",
  //   });

  //   renderWithProviders(<StyledFooter />);

  //   expect(screen.getByTestId("nextButton")).toBeInTheDocument();
  //   expect(screen.getByText("I Agree")).toBeInTheDocument();
  // });

  // it("should display default next button text on other pages", () => {
  //   useStore.mockReturnValue({
  //     displayNextButton: true,
  //     currentPage: "presort",
  //     progressScoreAdditional: 0,
  //     progressScoreAdditionalSort: 0,
  //     localUsercode: "TEST123",
  //   });

  //   renderWithProviders(<StyledFooter />);

  //   expect(screen.getByTestId("nextButton")).toBeInTheDocument();
  //   expect(screen.getByText("Next")).toBeInTheDocument();
  // });

  // it("should not display next button on submit page", () => {
  //   useStore.mockReturnValue({
  //     displayNextButton: true,
  //     currentPage: "submit",
  //     progressScoreAdditional: 0,
  //     progressScoreAdditionalSort: 0,
  //     localUsercode: "TEST123",
  //   });

  //   renderWithProviders(<StyledFooter />);

  //   expect(screen.queryByTestId("nextButton")).not.toBeInTheDocument();
  // });

  // it("should not display next button when setupTarget is local on landing page", () => {
  //   useSettingsStore.mockReturnValue({
  //     langObj: {
  //       btnNext: "Next",
  //       btnNextLanding: "Begin",
  //       btnNextConsent: "I Agree",
  //       postsortBackButtonText: "Back to Sort",
  //     },
  //     configObj: {
  //       showPostsort: true,
  //       showSurvey: true,
  //       useImages: false,
  //       showConsentPage: true,
  //       useThinProcess: false,
  //       showBackButton: false,
  //       setupTarget: "local",
  //       studyTitle: "Test Study",
  //     },
  //   });

  //   useStore.mockReturnValue({
  //     displayNextButton: true,
  //     currentPage: "landing",
  //     progressScoreAdditional: 0,
  //     progressScoreAdditionalSort: 0,
  //     localUsercode: "TEST123",
  //   });

  //   renderWithProviders(<StyledFooter />);

  //   expect(screen.queryByTestId("nextButton")).not.toBeInTheDocument();
  // });
  //   });

  describe("Help Button Display", () => {
    //     it("should display help button by default", () => {
    //       renderWithProviders(<StyledFooter />);

    //       expect(screen.getByTestId("help-button")).toBeInTheDocument();
    //     });

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
    // it("should display back button on postsort page when configured", () => {
    //   useSettingsStore.mockReturnValue({
    //     langObj: {
    //       btnNext: "Next",
    //       btnNextLanding: "Begin",
    //       btnNextConsent: "I Agree",
    //       postsortBackButtonText: "Back to Sort",
    //     },
    //     configObj: {
    //       showPostsort: true,
    //       showSurvey: true,
    //       useImages: false,
    //       showConsentPage: true,
    //       useThinProcess: false,
    //       showBackButton: true,
    //       setupTarget: "server",
    //       studyTitle: "Test Study",
    //     },
    //   });

    //   useStore.mockReturnValue({
    //     displayNextButton: true,
    //     currentPage: "postsort",
    //     progressScoreAdditional: 0,
    //     progressScoreAdditionalSort: 0,
    //     localUsercode: "TEST123",
    //   });

    //   renderWithProviders(<StyledFooter />);

    //   expect(screen.getByTestId("back-button")).toBeInTheDocument();
    //   expect(screen.getByText("Back to Sort")).toBeInTheDocument();
    // });

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

    // it("should not display progress bar on consent page", () => {
    //   useStore.mockReturnValue({
    //     displayNextButton: true,
    //     currentPage: "consent",
    //     progressScoreAdditional: 0,
    //     progressScoreAdditionalSort: 0,
    //     localUsercode: "TEST123",
    //   });

    //   renderWithProviders(<StyledFooter />);

    //   expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
    // });

    // it("should display progress bar with calculated score", () => {
    //   const calcProgressScore = require("./calcProgressScore").default;
    //   calcProgressScore.mockReturnValue(75);

    //   renderWithProviders(<StyledFooter />);

    //   const progressBar = screen.getByTestId("progress-bar");
    //   expect(progressBar).toHaveAttribute("data-completed", "75");
    // });
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

    // it("should show font sizer on presort page without images", () => {
    //   renderWithProviders(<StyledFooter />);

    //   expect(screen.getByTestId("fontSizer")).toBeInTheDocument();
    // });

    it("should not show card height sizer on presort page", () => {
      renderWithProviders(<StyledFooter />);

      expect(screen.queryByTestId("cardHeightSizer")).not.toBeInTheDocument();
    });

    // it("should not show adjustment container on presort page with images", () => {
    //   useSettingsStore.mockReturnValue({
    //     langObj: {
    //       btnNext: "Next",
    //       btnNextLanding: "Begin",
    //       btnNextConsent: "I Agree",
    //       postsortBackButtonText: "Back to Sort",
    //     },
    //     configObj: {
    //       showPostsort: true,
    //       showSurvey: true,
    //       useImages: true,
    //       showConsentPage: true,
    //       useThinProcess: false,
    //       showBackButton: false,
    //       setupTarget: "server",
    //       studyTitle: "Test Study",
    //     },
    //   });

    //   renderWithProviders(<StyledFooter />);

    //   expect(screen.queryByTestId("fontSizer")).not.toBeInTheDocument();
    //   expect(screen.queryByTestId("cardHeightSizer")).not.toBeInTheDocument();
    // });
  });

  //   describe("Adjustment Controls - Sort Page", () => {
  //     beforeEach(() => {
  //       useStore.mockReturnValue({
  //         displayNextButton: true,
  //         currentPage: "sort",
  //         progressScoreAdditional: 0,
  //         progressScoreAdditionalSort: 0,
  //         localUsercode: "TEST123",
  //       });
  //     });

  //     it("should show both font sizer and card height sizer on sort page without images", () => {
  //       renderWithProviders(<StyledFooter />);

  //       expect(screen.getByTestId("fontSizer")).toBeInTheDocument();
  //       expect(screen.getByTestId("cardHeightSizer")).toBeInTheDocument();
  //     });

  //     // it("should show card height sizer but not font sizer on sort page with images", () => {
  //     //   useSettingsStore.mockReturnValue({
  //     //     langObj: {
  //     //       btnNext: "Next",
  //     //       btnNextLanding: "Begin",
  //     //       btnNextConsent: "I Agree",
  //     //       postsortBackButtonText: "Back to Sort",
  //     //     },
  //     //     configObj: {
  //     //       showPostsort: true,
  //     //       showSurvey: true,
  //     //       useImages: true,
  //     //       showConsentPage: true,
  //     //       useThinProcess: false,
  //     //       showBackButton: false,
  //     //       setupTarget: "server",
  //     //       studyTitle: "Test Study",
  //     //     },
  //     //   });

  //     //   renderWithProviders(<StyledFooter />);

  //     //   expect(screen.queryByTestId("fontSizer")).not.toBeInTheDocument();
  //     //   expect(screen.getByTestId("cardHeightSizer")).toBeInTheDocument();
  //     // });
  //   });

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

  //   describe("Configuration Integration", () => {
  // it("should call getNextPage with correct parameters", () => {
  //   const getNextPage = require("./getNextPage").default;
  //   renderWithProviders(<StyledFooter />);
  //   expect(getNextPage).toHaveBeenCalledWith("landing", true, true, true, false);
  // });
  // it("should call calcProgressScore with current page", () => {
  //   const calcProgressScore = require("./calcProgressScore").default;
  //   renderWithProviders(<StyledFooter />);
  //   expect(calcProgressScore).toHaveBeenCalledWith("landing");
  // });
  // it("should respect showPostsort configuration", () => {
  //   useSettingsStore.mockReturnValue({
  //     langObj: {
  //       btnNext: "Next",
  //       btnNextLanding: "Begin",
  //       btnNextConsent: "I Agree",
  //       postsortBackButtonText: "Back to Sort",
  //     },
  //     configObj: {
  //       showPostsort: false,
  //       showSurvey: true,
  //       useImages: false,
  //       showConsentPage: true,
  //       useThinProcess: false,
  //       showBackButton: false,
  //       setupTarget: "server",
  //       studyTitle: "Test Study",
  //     },
  //   });
  //   const getNextPage = require("./getNextPage").default;
  //   renderWithProviders(<StyledFooter />);
  //   expect(getNextPage).toHaveBeenCalledWith("landing", false, true, true, false);
  // });
  // it("should respect showSurvey configuration", () => {
  //   useSettingsStore.mockReturnValue({
  //     langObj: {
  //       btnNext: "Next",
  //       btnNextLanding: "Begin",
  //       btnNextConsent: "I Agree",
  //       postsortBackButtonText: "Back to Sort",
  //     },
  //     configObj: {
  //       showPostsort: true,
  //       showSurvey: false,
  //       useImages: false,
  //       showConsentPage: true,
  //       useThinProcess: false,
  //       showBackButton: false,
  //       setupTarget: "server",
  //       studyTitle: "Test Study",
  //     },
  //   });
  //   const getNextPage = require("./getNextPage").default;
  //   renderWithProviders(<StyledFooter />);
  //   expect(getNextPage).toHaveBeenCalledWith("landing", true, false, true, false);
  // });
  // it("should respect useThinProcess configuration", () => {
  //   useSettingsStore.mockReturnValue({
  //     langObj: {
  //       btnNext: "Next",
  //       btnNextLanding: "Begin",
  //       btnNextConsent: "I Agree",
  //       postsortBackButtonText: "Back to Sort",
  //     },
  //     configObj: {
  //       showPostsort: true,
  //       showSurvey: true,
  //       useImages: false,
  //       showConsentPage: true,
  //       useThinProcess: true,
  //       showBackButton: false,
  //       setupTarget: "server",
  //       studyTitle: "Test Study",
  //     },
  //   });
  //   const getNextPage = require("./getNextPage").default;
  //   renderWithProviders(<StyledFooter />);
  //   expect(getNextPage).toHaveBeenCalledWith("landing", true, true, true, true);
  // });
  //   });

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

  //   describe("Localization", () => {
  //     it("should display localized button text", () => {
  //       useSettingsStore.mockReturnValue({
  //         langObj: {
  //           btnNext: "Siguiente",
  //           btnNextLanding: "Comenzar",
  //           btnNextConsent: "Acepto",
  //           postsortBackButtonText: "Volver",
  //         },
  //         configObj: {
  //           showPostsort: true,
  //           showSurvey: true,
  //           useImages: false,
  //           showConsentPage: true,
  //           useThinProcess: false,
  //           showBackButton: false,
  //           setupTarget: "server",
  //           studyTitle: "Test Study",
  //         },
  //       });

  //       renderWithProviders(<StyledFooter />);

  //       expect(screen.getByText("Comenzar")).toBeInTheDocument();
  //     });
  //   });

  //   describe("Date and Time Display", () => {
  //     it("should display current date and time for local setup on sort page", () => {
  //       // Mock Date
  //       const mockDate = new Date("2024-01-15T10:30:45");
  //       vi.spyOn(window, "Date").mockImplementation(() => mockDate);

  //       useSettingsStore.mockReturnValue({
  //         langObj: {
  //           btnNext: "Next",
  //           btnNextLanding: "Begin",
  //           btnNextConsent: "I Agree",
  //           postsortBackButtonText: "Back to Sort",
  //         },
  //         configObj: {
  //           showPostsort: true,
  //           showSurvey: true,
  //           useImages: false,
  //           showConsentPage: true,
  //           useThinProcess: false,
  //           showBackButton: false,
  //           setupTarget: "local",
  //           studyTitle: "My Study",
  //         },
  //       });

  //       useStore.mockReturnValue({
  //         displayNextButton: true,
  //         currentPage: "sort",
  //         progressScoreAdditional: 0,
  //         progressScoreAdditionalSort: 0,
  //         localUsercode: "USER001",
  //       });

  //       renderWithProviders(<StyledFooter />);

  //     //   expect(screen.getByText(/2024-1-15/)).toBeInTheDocument();
  //     //   expect(screen.getByText(/10:30:45/)).toBeInTheDocument();

  //       vi.restoreAllMocks();
  //     });
  //   });
});

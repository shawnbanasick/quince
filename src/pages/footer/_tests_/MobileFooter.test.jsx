import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import StyledFooter from "../MobileFooter";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";
import useScreenOrientation from "../../../utilities/useScreenOrientation";
import getNextPage from "../getNextPage";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");
vi.mock("../../../utilities/useScreenOrientation");
vi.mock("../getNextPage");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (str) => str,
}));
vi.mock("html-react-parser", () => ({
  default: (str) => str,
}));

// Mock child components
vi.mock("../MobileNextButton", () => ({
  default: ({ children, to, width }) => (
    <div data-testid="mobileFooterNextButton" data-to={to} data-width={width}>
      {children}
    </div>
  ),
}));
vi.mock("../MobileFooterFontSizer", () => ({
  default: () => <div data-testid="mobileFooterFontSizerComp">Font Sizer</div>,
}));
vi.mock("../MobileFooterViewSizer", () => ({
  default: () => <div data-testid="mobileFooterViewSizerComp">View Sizer</div>,
}));
vi.mock("../MobileSurveyBackButton", () => ({
  default: ({ children, to }) => (
    <div data-testid="mobile-survey-back-button" data-to={to}>
      {children}
    </div>
  ),
}));

describe("StyledFooter", () => {
  const mockLangObj = {
    btnNextLanding: "Start",
    btnNextConsent: "I Agree - Continue",
    btnNext: "Next",
    postsortBackButtonText: "Back",
  };

  const mockConfigObj = {
    showPostsort: true,
    showSurvey: true,
    showConsentPage: true,
    useThinProcess: true,
    setupTarget: "server",
    studyTitle: "Test Study",
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

    // Mock useScreenOrientation to return portrait by default
    useScreenOrientation.mockReturnValue("portrait-primary");

    // Mock getNextPage
    getNextPage.mockReturnValue("/presort");
  });

  const setupStore = (page, displayNextButton = true, localUsercode = "user123") => {
    useStore.mockImplementation((selector) => {
      const state = {
        currentPage: page,
        displayNextButton: displayNextButton,
        localUsercode: localUsercode,
      };
      return selector(state);
    });
  };

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe("rendering", () => {
    it("renders the footer component", () => {
      setupStore("presort");
      render(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterDiv")).toBeInTheDocument();
    });

    it("does not render when in landscape orientation", () => {
      useScreenOrientation.mockReturnValue("landscape-primary");
      setupStore("presort");
      const { container } = render(<StyledFooter />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("logo display", () => {
    it("shows logo on landing page", () => {
      setupStore("landing");
      render(<StyledFooter />);
      // Look for the logo HTML string
      expect(screen.getByTestId("logoDiv")).toBeInTheDocument();
    });

    it("shows logo on consent page", () => {
      setupStore("consent");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("logoDiv")).toBeInTheDocument();
    });

    it("shows logo on submit page", () => {
      setupStore("submit");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("logoDiv")).toBeInTheDocument();
    });

    it("does not show logo on presort page", () => {
      setupStore("presort");
      render(<StyledFooter />);

      expect(screen.queryByTestId("logoDiv")).not.toBeInTheDocument();
    });

    it("does not show logo on sort page", () => {
      setupStore("sort");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("logoDiv")).not.toBeInTheDocument();
    });

    it("does not show logo on postsort page", () => {
      setupStore("postsort");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("logoDiv")).not.toBeInTheDocument();
    });

    it("does not show logo on survey page", () => {
      setupStore("survey");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("logoDiv")).not.toBeInTheDocument();
    });

    it("does not show logo on thin page", () => {
      setupStore("thin");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("logoDiv")).not.toBeInTheDocument();
    });
  });

  describe("next button display", () => {
    it("shows next button on landing page", () => {
      setupStore("landing");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterNextButton")).toBeInTheDocument();
    });

    it("shows next button on consent page", () => {
      setupStore("consent");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterNextButton")).toBeInTheDocument();
    });

    it("shows next button on presort page", () => {
      setupStore("presort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterNextButton")).toBeInTheDocument();
    });

    it("shows next button on thin page", () => {
      setupStore("thin");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterNextButton")).toBeInTheDocument();
    });

    it("shows next button on sort page", () => {
      setupStore("sort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterNextButton")).toBeInTheDocument();
    });

    it("shows next button on postsort page", () => {
      setupStore("postsort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterNextButton")).toBeInTheDocument();
    });

    it("shows next button on survey page", () => {
      setupStore("survey");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterNextButton")).toBeInTheDocument();
    });

    it("does not show next button on submit page", () => {
      setupStore("submit");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterNextButton")).not.toBeInTheDocument();
    });

    it("does not show next button on landing page when displayNextButton is false", () => {
      setupStore("landing", false);
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterNextButton")).not.toBeInTheDocument();
    });
  });

  describe("next button text", () => {
    it("shows landing-specific text on landing page", () => {
      setupStore("landing");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByText("Start")).toBeInTheDocument();
    });

    it("shows consent-specific text on consent page", () => {
      setupStore("consent");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByText("I Agree - Continue")).toBeInTheDocument();
    });

    it("shows default next text on presort page", () => {
      setupStore("presort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("shows default next text on sort page", () => {
      setupStore("sort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });

  describe("next button width", () => {
    it("sets width to 60 on landing page", () => {
      setupStore("landing");
      renderWithRouter(<StyledFooter />);

      const button = screen.getByTestId("mobileFooterNextButton");
      expect(button).toHaveAttribute("data-width", "60");
    });

    it("sets width to 180 on consent page", () => {
      setupStore("consent");
      renderWithRouter(<StyledFooter />);

      const button = screen.getByTestId("mobileFooterNextButton");
      expect(button).toHaveAttribute("data-width", "180");
    });

    it("sets width to 60 on presort page", () => {
      setupStore("presort");
      renderWithRouter(<StyledFooter />);

      const button = screen.getByTestId("mobileFooterNextButton");
      expect(button).toHaveAttribute("data-width", "60");
    });
  });

  describe("back button display", () => {
    it("shows back button on survey page", () => {
      setupStore("survey");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobile-survey-back-button")).toBeInTheDocument();
      expect(screen.getByText("Back")).toBeInTheDocument();
    });

    it("does not show back button on presort page", () => {
      setupStore("presort");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobile-survey-back-button")).not.toBeInTheDocument();
    });

    it("does not show back button on sort page", () => {
      setupStore("sort");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobile-survey-back-button")).not.toBeInTheDocument();
    });

    it("does not show back button on postsort page", () => {
      setupStore("postsort");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobile-survey-back-button")).not.toBeInTheDocument();
    });

    it("back button links to postsort page", () => {
      setupStore("survey");
      renderWithRouter(<StyledFooter />);

      const backButton = screen.getByTestId("mobile-survey-back-button");
      expect(backButton).toHaveAttribute("data-to", "/postsort");
    });
  });

  describe("font sizer display", () => {
    it("shows font sizer on presort page", () => {
      setupStore("presort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterFontSizerComp")).toBeInTheDocument();
    });

    it("shows font sizer on thin page", () => {
      setupStore("thin");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterFontSizerComp")).toBeInTheDocument();
    });

    it("shows font sizer on sort page", () => {
      setupStore("sort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterFontSizerComp")).toBeInTheDocument();
    });

    it("shows font sizer on postsort page", () => {
      setupStore("postsort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterFontSizerComp")).toBeInTheDocument();
    });

    it("does not show font sizer on landing page", () => {
      setupStore("landing");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterFontSizerComp")).not.toBeInTheDocument();
    });

    it("does not show font sizer on consent page", () => {
      setupStore("consent");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterFontSizerComp")).not.toBeInTheDocument();
    });

    it("does not show font sizer on submit page", () => {
      setupStore("submit");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterFontSizerComp")).not.toBeInTheDocument();
    });

    it("does not show font sizer on survey page", () => {
      setupStore("survey");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterFontSizerComp")).not.toBeInTheDocument();
    });
  });

  describe("view sizer display", () => {
    it("shows view sizer on presort page", () => {
      setupStore("presort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterViewSizerComp")).toBeInTheDocument();
    });

    it("shows view sizer on thin page", () => {
      setupStore("thin");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterViewSizerComp")).toBeInTheDocument();
    });

    it("shows view sizer on sort page", () => {
      setupStore("sort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterViewSizerComp")).toBeInTheDocument();
    });

    it("shows view sizer on postsort page", () => {
      setupStore("postsort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterViewSizerComp")).toBeInTheDocument();
    });

    it("shows view sizer on survey page", () => {
      setupStore("survey");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterViewSizerComp")).toBeInTheDocument();
    });

    it("does not show view sizer on landing page", () => {
      setupStore("landing");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterViewSizerComp")).not.toBeInTheDocument();
    });

    it("does not show view sizer on consent page", () => {
      setupStore("consent");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterViewSizerComp")).not.toBeInTheDocument();
    });

    it("does not show view sizer on submit page", () => {
      setupStore("submit");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterViewSizerComp")).not.toBeInTheDocument();
    });
  });

  describe("getNextPage integration", () => {
    it("calls getNextPage with correct parameters", () => {
      setupStore("presort");
      renderWithRouter(<StyledFooter />);

      expect(getNextPage).toHaveBeenCalledWith("presort", true, true, true, true);
    });

    it("passes showPostsort from config", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: mockLangObj,
          configObj: {
            ...mockConfigObj,
            showPostsort: false,
          },
        };
        return selector(state);
      });
      setupStore("presort");

      renderWithRouter(<StyledFooter />);

      expect(getNextPage).toHaveBeenCalledWith("presort", false, true, true, true);
    });

    it("passes showSurvey from config", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: mockLangObj,
          configObj: {
            ...mockConfigObj,
            showSurvey: false,
          },
        };
        return selector(state);
      });
      setupStore("presort");

      renderWithRouter(<StyledFooter />);

      expect(getNextPage).toHaveBeenCalledWith("presort", true, false, true, true);
    });

    it("passes showConsent from config", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: mockLangObj,
          configObj: {
            ...mockConfigObj,
            showConsentPage: false,
          },
        };
        return selector(state);
      });
      setupStore("presort");

      renderWithRouter(<StyledFooter />);

      expect(getNextPage).toHaveBeenCalledWith("presort", true, true, false, true);
    });

    it("passes showThinning from config", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: mockLangObj,
          configObj: {
            ...mockConfigObj,
            useThinProcess: false,
          },
        };
        return selector(state);
      });
      setupStore("presort");

      renderWithRouter(<StyledFooter />);

      expect(getNextPage).toHaveBeenCalledWith("presort", true, true, true, false);
    });

    it("passes returned path to MobileNextButton", () => {
      getNextPage.mockReturnValue("/thin");
      setupStore("presort");

      renderWithRouter(<StyledFooter />);

      const nextButton = screen.getByTestId("mobileFooterNextButton");
      expect(nextButton).toHaveAttribute("data-to", "/thin");
    });
  });

  describe("edge cases", () => {
    it("handles undefined currentPage", () => {
      setupStore(undefined);
      const { container } = renderWithRouter(<StyledFooter />);

      expect(container).toBeInTheDocument();
    });

    it("handles null currentPage", () => {
      setupStore(null);
      const { container } = renderWithRouter(<StyledFooter />);

      expect(container).toBeInTheDocument();
    });

    it("handles missing langObj properties", () => {
      useSettingsStore.mockImplementation((selector) => {
        const state = {
          langObj: {
            btnNext: undefined,
            btnNextLanding: undefined,
            btnNextConsent: undefined,
            postsortBackButtonText: undefined,
          },
          configObj: mockConfigObj,
        };
        return selector(state);
      });
      setupStore("presort");

      const { container } = renderWithRouter(<StyledFooter />);
      expect(container).toBeInTheDocument();
    });

    it("handles unknown page type", () => {
      setupStore("unknownPage");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterDiv")).toBeInTheDocument();
    });
  });

  describe("screen orientation", () => {
    it("renders in portrait-primary orientation", () => {
      useScreenOrientation.mockReturnValue("portrait-primary");
      setupStore("presort");

      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterDiv")).toBeInTheDocument();
    });

    it("renders in portrait-secondary orientation", () => {
      useScreenOrientation.mockReturnValue("portrait-secondary");
      setupStore("presort");

      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterDiv")).toBeInTheDocument();
    });

    it("does not render in landscape-secondary orientation", () => {
      useScreenOrientation.mockReturnValue("landscape-primary");
      setupStore("presort");

      const { container } = renderWithRouter(<StyledFooter />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("component combinations", () => {
    it("displays correct components on presort page", () => {
      setupStore("presort");
      renderWithRouter(<StyledFooter />);

      expect(screen.getByTestId("mobileFooterFontSizerComp")).toBeInTheDocument();
      expect(screen.getByTestId("mobileFooterViewSizerComp")).toBeInTheDocument();
      expect(screen.getByTestId("mobileFooterNextButton")).toBeInTheDocument();
      expect(screen.queryByTestId("mobile-survey-back-button")).not.toBeInTheDocument();
      expect(screen.queryByText(/<center>/)).not.toBeInTheDocument();
    });

    it("displays correct components on survey page", () => {
      setupStore("survey");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterFontSizerComp")).not.toBeInTheDocument();
      expect(screen.getByTestId("mobileFooterViewSizerComp")).toBeInTheDocument();
      expect(screen.getByTestId("mobileFooterNextButton")).toBeInTheDocument();
      expect(screen.getByTestId("mobile-survey-back-button")).toBeInTheDocument();
      expect(screen.queryByText(/<center>/)).not.toBeInTheDocument();
    });

    it("displays correct components on landing page", () => {
      setupStore("landing");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterFontSizerComp")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mobileFooterViewSizerComp")).not.toBeInTheDocument();
      expect(screen.getByTestId("mobileFooterNextButton")).toBeInTheDocument();
      expect(screen.queryByTestId("mobile-survey-back-button")).not.toBeInTheDocument();
    });

    it("displays correct components on submit page", () => {
      setupStore("submit");
      renderWithRouter(<StyledFooter />);

      expect(screen.queryByTestId("mobileFooterFontSizerComp")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mobileFooterViewSizerComp")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mobileFooterNextButton")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mobile-survey-back-button")).not.toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import LinkButton from "../MobileNextButton";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// Mock theme for styled-components
const mockTheme = {
  primary: "#337ab7",
  secondary: "#286090",
  focus: "#204d74",
};

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value?.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();

window.localStorage = localStorageMock;

// Helper to render with theme and router
const renderWithProviders = (component, history = createMemoryHistory()) => {
  return render(
    <Router history={history}>
      <ThemeProvider theme={mockTheme}>{component}</ThemeProvider>
    </Router>
  );
};

describe("LinkButton", () => {
  let mockSetTriggerPresortPreventNavModal;
  let mockSetCheckRequiredQuestionsComplete;
  let mockSetTriggerSurveyPreventNavModal;
  let mockSetShowPostsortCommentHighlighting;
  let mockSetTriggerMobilePostsortPreventNavModal;
  let mockSetTriggerMobileThinPreventNavModal;
  let mockSetTriggerMobileSortScrollBottomModal;
  let history;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    localStorageMock.clear();

    // Create new history for each test
    history = createMemoryHistory();

    // Setup mock functions
    mockSetTriggerPresortPreventNavModal = vi.fn();
    mockSetCheckRequiredQuestionsComplete = vi.fn();
    mockSetTriggerSurveyPreventNavModal = vi.fn();
    mockSetShowPostsortCommentHighlighting = vi.fn();
    mockSetTriggerMobilePostsortPreventNavModal = vi.fn();
    mockSetTriggerMobileThinPreventNavModal = vi.fn();
    mockSetTriggerMobileSortScrollBottomModal = vi.fn();

    // Mock useSettingsStore
    useSettingsStore.mockReturnValue({
      configObj: {
        allowUnforcedSorts: false,
        postsortCommentsRequired: false,
      },
    });

    // Mock useStore with default values
    useStore.mockImplementation((selector) => {
      const mockState = {
        presortFinished: false,
        setTriggerMobilePresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
        currentPage: "landing",
        setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
        setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
        setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
        setTriggerMobilePostsortPreventNavModal: mockSetTriggerMobilePostsortPreventNavModal,
        setTriggerMobileThinPreventNavModal: mockSetTriggerMobileThinPreventNavModal,
        hasScrolledToBottomSort: false,
        setTriggerMobileSortScrollBottomModal: mockSetTriggerMobileSortScrollBottomModal,
      };
      return selector(mockState);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the button with children text", () => {
      renderWithProviders(<LinkButton to="/next">Next</LinkButton>, history);

      expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    });

    it("should apply width prop to styled component", () => {
      renderWithProviders(
        <LinkButton to="/next" width={200}>
          Next
        </LinkButton>,
        history
      );

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ width: "200px" });
    });
  });

  describe("Basic Navigation", () => {
    it("should navigate to target page when no conditions block it", () => {
      renderWithProviders(<LinkButton to="/landing">Go to Landing</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/landing");
    });

    it("should call custom onClick handler if provided", () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <LinkButton to="/next" onClick={handleClick}>
          Next
        </LinkButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Presort Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerMobilePresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "presort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerMobilePostsortPreventNavModal: mockSetTriggerMobilePostsortPreventNavModal,
          setTriggerMobileThinPreventNavModal: mockSetTriggerMobileThinPreventNavModal,
          hasScrolledToBottomSort: false,
          setTriggerMobileSortScrollBottomModal: mockSetTriggerMobileSortScrollBottomModal,
        };
        return selector(mockState);
      });
    });

    it("should prevent navigation when presort is not finished", () => {
      localStorage.setItem("m_PresortFinished", "false");

      renderWithProviders(<LinkButton to="/thin">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerPresortPreventNavModal).toHaveBeenCalledWith(true);
      expect(history.location.pathname).toBe("/");
    });

    it('should allow navigation when presort is finished (string "true")', () => {
      localStorage.setItem("m_PresortFinished", "true");

      renderWithProviders(<LinkButton to="/thin">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerPresortPreventNavModal).toHaveBeenCalledWith(false);
      expect(history.location.pathname).toBe("/thin");
    });

    it("should allow navigation when presort is finished (boolean true)", () => {
      localStorage.setItem("m_PresortFinished", true);

      renderWithProviders(<LinkButton to="/thin">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerPresortPreventNavModal).toHaveBeenCalledWith(false);
      expect(history.location.pathname).toBe("/thin");
    });

    it("should set display false in localStorage when presort is finished", () => {
      localStorage.setItem("m_PresortFinished", "true");

      renderWithProviders(<LinkButton to="/thin">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "m_PresortDisplayStatements",
        JSON.stringify({ display: false })
      );
    });
  });

  describe("Thin Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerMobilePresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "thin",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerMobilePostsortPreventNavModal: mockSetTriggerMobilePostsortPreventNavModal,
          setTriggerMobileThinPreventNavModal: mockSetTriggerMobileThinPreventNavModal,
          hasScrolledToBottomSort: false,
          setTriggerMobileSortScrollBottomModal: mockSetTriggerMobileSortScrollBottomModal,
        };
        return selector(mockState);
      });
    });

    it("should prevent navigation when thinning is not finished", () => {
      localStorage.setItem("m_ThinningFinished", "false");

      renderWithProviders(<LinkButton to="/sort">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerMobileThinPreventNavModal).toHaveBeenCalledWith(true);
      expect(history.location.pathname).toBe("/");
    });

    it("should allow navigation when thinning is finished", () => {
      localStorage.setItem("m_ThinningFinished", "true");

      renderWithProviders(<LinkButton to="/sort">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/sort");
    });
  });

  describe("Sort Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerMobilePresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "sort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerMobilePostsortPreventNavModal: mockSetTriggerMobilePostsortPreventNavModal,
          setTriggerMobileThinPreventNavModal: mockSetTriggerMobileThinPreventNavModal,
          hasScrolledToBottomSort: false,
          setTriggerMobileSortScrollBottomModal: mockSetTriggerMobileSortScrollBottomModal,
        };
        return selector(mockState);
      });
    });

    it("should prevent navigation when user has not scrolled to bottom", () => {
      renderWithProviders(<LinkButton to="/postsort">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerMobileSortScrollBottomModal).toHaveBeenCalledWith(true);
      expect(history.location.pathname).toBe("/");
    });

    it("should allow navigation when user has scrolled to bottom", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerMobilePresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "sort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerMobilePostsortPreventNavModal: mockSetTriggerMobilePostsortPreventNavModal,
          setTriggerMobileThinPreventNavModal: mockSetTriggerMobileThinPreventNavModal,
          hasScrolledToBottomSort: true,
          setTriggerMobileSortScrollBottomModal: mockSetTriggerMobileSortScrollBottomModal,
        };
        return selector(mockState);
      });

      renderWithProviders(<LinkButton to="/postsort">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/postsort");
    });
  });

  describe("Postsort Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerMobilePresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "postsort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerMobilePostsortPreventNavModal: mockSetTriggerMobilePostsortPreventNavModal,
          setTriggerMobileThinPreventNavModal: mockSetTriggerMobileThinPreventNavModal,
          hasScrolledToBottomSort: false,
          setTriggerMobileSortScrollBottomModal: mockSetTriggerMobileSortScrollBottomModal,
        };
        return selector(mockState);
      });
    });

    it("should allow navigation when comments are not required", () => {
      localStorage.setItem("m_PosRequiredStatesObj", JSON.stringify({ item1: "" }));
      localStorage.setItem("m_NegRequiredStatesObj", JSON.stringify({ item2: "" }));

      renderWithProviders(<LinkButton to="/survey">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/survey");
    });

    it("should allow navigation when all required comments are complete", () => {
      useSettingsStore.mockReturnValue({
        configObj: {
          allowUnforcedSorts: false,
          postsortCommentsRequired: true,
        },
      });

      localStorage.setItem("m_PosRequiredStatesObj", JSON.stringify({ item1: "comment1" }));
      localStorage.setItem("m_NegRequiredStatesObj", JSON.stringify({ item2: "comment2" }));

      renderWithProviders(<LinkButton to="/survey">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/survey");
    });

    it("should handle null localStorage values gracefully", () => {
      localStorage.setItem("m_PosRequiredStatesObj", null);
      localStorage.setItem("m_NegRequiredStatesObj", null);

      renderWithProviders(<LinkButton to="/survey">Next</LinkButton>, history);

      const button = screen.getByRole("button");

      // Should not throw error
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe("Survey Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerMobilePresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "survey",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerMobilePostsortPreventNavModal: mockSetTriggerMobilePostsortPreventNavModal,
          setTriggerMobileThinPreventNavModal: mockSetTriggerMobileThinPreventNavModal,
          hasScrolledToBottomSort: false,
          setTriggerMobileSortScrollBottomModal: mockSetTriggerMobileSortScrollBottomModal,
        };
        return selector(mockState);
      });
    });

    it("should prevent navigation when survey has unanswered questions", () => {
      localStorage.setItem(
        "resultsSurvey",
        JSON.stringify({
          question1: "answer1",
          question2: "no-*?*-response",
        })
      );

      renderWithProviders(<LinkButton to="/submit">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetCheckRequiredQuestionsComplete).toHaveBeenCalledWith(true);
      expect(mockSetTriggerSurveyPreventNavModal).toHaveBeenCalledWith(true);
      expect(history.location.pathname).toBe("/");
    });

    it("should allow navigation when all survey questions are answered", () => {
      localStorage.setItem(
        "resultsSurvey",
        JSON.stringify({
          question1: "answer1",
          question2: "answer2",
        })
      );

      renderWithProviders(<LinkButton to="/submit">Next</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/submit");
    });

    it("should handle null resultsSurvey gracefully", () => {
      localStorage.setItem("resultsSurvey", null);

      renderWithProviders(<LinkButton to="/submit">Next</LinkButton>, history);

      const button = screen.getByRole("button");

      // Should not throw error
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe("Props Filtering", () => {
    it("should filter out router props from button element", () => {
      const { container } = renderWithProviders(<LinkButton to="/next">Next</LinkButton>, history);

      const button = container.querySelector("button");

      // These props should not be on the button DOM element
      expect(button).not.toHaveAttribute("to");
      expect(button).not.toHaveAttribute("history");
      expect(button).not.toHaveAttribute("location");
      expect(button).not.toHaveAttribute("match");
      expect(button).not.toHaveAttribute("staticContext");
    });

    it("should pass through other valid props", () => {
      renderWithProviders(
        <LinkButton to="/next" data-testid="test-button" aria-label="Next button">
          Next
        </LinkButton>,
        history
      );

      const button = screen.getByTestId("test-button");
      expect(button).toHaveAttribute("aria-label", "Next button");
    });
  });

  describe("Edge Cases", () => {
    it("should handle clicks without custom onClick handler", () => {
      renderWithProviders(<LinkButton to="/next">Next</LinkButton>, history);

      const button = screen.getByRole("button");

      // Should not throw error
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("should handle multiple rapid clicks", () => {
      renderWithProviders(<LinkButton to="/landing">Go</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Should navigate only once per click, but to same location
      expect(history.location.pathname).toBe("/landing");
    });

    it("should handle pages without validation checks", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerMobilePresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "submit",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerMobilePostsortPreventNavModal: mockSetTriggerMobilePostsortPreventNavModal,
          setTriggerMobileThinPreventNavModal: mockSetTriggerMobileThinPreventNavModal,
          hasScrolledToBottomSort: false,
          setTriggerMobileSortScrollBottomModal: mockSetTriggerMobileSortScrollBottomModal,
        };
        return selector(mockState);
      });

      renderWithProviders(<LinkButton to="/thankyou">Finish</LinkButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Should navigate without any checks
      expect(history.location.pathname).toBe("/thankyou");
    });
  });

  describe("Config Object Properties", () => {
    it("should access allowUnforcedSorts from config", () => {
      useSettingsStore.mockReturnValue({
        configObj: {
          allowUnforcedSorts: true,
          postsortCommentsRequired: false,
        },
      });

      renderWithProviders(<LinkButton to="/next">Next</LinkButton>, history);

      // Component should render without error
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should access postsortCommentsRequired from config", () => {
      useSettingsStore.mockReturnValue({
        configObj: {
          allowUnforcedSorts: false,
          postsortCommentsRequired: true,
        },
      });

      renderWithProviders(<LinkButton to="/next">Next</LinkButton>, history);

      // Component should render without error
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});

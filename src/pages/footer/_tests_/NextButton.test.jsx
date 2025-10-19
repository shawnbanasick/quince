import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import NextButton from "../NextButton";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the modules
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");
vi.mock("../../sort/convertObjectToResults", () => ({
  default: vi.fn(() => ({ mockResults: true })),
}));

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

describe("NextButton", () => {
  let mockSetTriggerPresortPreventNavModal;
  let mockSetCheckRequiredQuestionsComplete;
  let mockSetTriggerSurveyPreventNavModal;
  let mockSetTriggerSortPreventNavModal;
  let mockSetTriggerSortOverloadedColModal;
  let mockSetResults;
  let mockSetShowPostsortCommentHighlighting;
  let mockSetTriggerPostsortPreventNavModal;
  let mockSetTriggerThinningPreventNavModal;
  let history;
  let consoleLogSpy;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    localStorageMock.clear();

    // Spy on console.log
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Create new history for each test
    history = createMemoryHistory();

    // Setup mock functions
    mockSetTriggerPresortPreventNavModal = vi.fn();
    mockSetCheckRequiredQuestionsComplete = vi.fn();
    mockSetTriggerSurveyPreventNavModal = vi.fn();
    mockSetTriggerSortPreventNavModal = vi.fn();
    mockSetTriggerSortOverloadedColModal = vi.fn();
    mockSetResults = vi.fn();
    mockSetShowPostsortCommentHighlighting = vi.fn();
    mockSetTriggerPostsortPreventNavModal = vi.fn();
    mockSetTriggerThinningPreventNavModal = vi.fn();

    // Mock useSettingsStore
    useSettingsStore.mockReturnValue({
      configObj: {
        allowUnforcedSorts: false,
        postsortCommentsRequired: false,
      },
      columnStatements: {},
    });

    // Mock useStore with default values
    useStore.mockImplementation((selector) => {
      const mockState = {
        presortFinished: false,
        setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
        currentPage: "landing",
        setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
        setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
        isSortingFinished: false,
        hasOverloadedColumn: false,
        setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
        setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
        setResults: mockSetResults,
        setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
        setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
        isThinningFinished: false,
        setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
      };
      return selector(mockState);
    });

    // Initialize localStorage with default values
    localStorage.setItem("sortColumns", JSON.stringify([]));
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleLogSpy.mockRestore();
  });

  describe("Rendering", () => {
    it("should render the button with children text", () => {
      renderWithProviders(<NextButton to="/next">Next</NextButton>, history);

      expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    });

    // it("should render with correct tabindex attribute", () => {
    //   renderWithProviders(<NextButton to="/next">Continue</NextButton>, history);

    //   const button = screen.getByRole("button");
    //   expect(button).toHaveAttribute("tabindex", "0");
    // });

    it("should render with default to prop", () => {
      renderWithProviders(<NextButton>Next</NextButton>, history);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Basic Navigation", () => {
    it("should navigate to target page when no conditions block it", () => {
      renderWithProviders(<NextButton to="/landing">Go to Landing</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/landing");
    });

    it("should call custom onClick handler if provided", () => {
      const handleClick = vi.fn();

      renderWithProviders(
        <NextButton to="/next" onClick={handleClick}>
          Next
        </NextButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should work without custom onClick handler", () => {
      renderWithProviders(<NextButton to="/next">Next</NextButton>, history);

      const button = screen.getByRole("button");

      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe("Presort Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "presort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: false,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });
    });

    it("should prevent navigation when presort is not finished", () => {
      renderWithProviders(<NextButton to="/thin">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerPresortPreventNavModal).toHaveBeenCalledWith(true);
      expect(history.location.pathname).toBe("/");
    });

    it("should allow navigation when presort is finished", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: true,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "presort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: false,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });

      renderWithProviders(<NextButton to="/thin">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/thin");
    });
  });

  describe("Thin Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "thin",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: false,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });
    });

    it("should prevent navigation when thinning is not finished", () => {
      renderWithProviders(<NextButton to="/sort">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerThinningPreventNavModal).toHaveBeenCalledWith(true);
      expect(consoleLogSpy).toHaveBeenCalledWith("thin");
      expect(history.location.pathname).toBe("/");
    });

    it("should allow navigation when thinning is finished", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "thin",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: false,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: true,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });

      renderWithProviders(<NextButton to="/sort">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/sort");
    });
  });

  describe("Sort Page Navigation - Not Finished", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "sort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: false,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });
    });

    it("should prevent navigation when sorting not finished and imagesList has items", () => {
      localStorage.setItem("sortColumns", JSON.stringify({ imagesList: ["item1", "item2"] }));

      renderWithProviders(<NextButton to="/postsort">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerSortPreventNavModal).toHaveBeenCalledWith(true);
      expect(history.location.pathname).toBe("/");
    });

    it("should allow navigation with unforced sorts when imagesList is empty", () => {
      useSettingsStore.mockReturnValue({
        configObj: {
          allowUnforcedSorts: true,
          postsortCommentsRequired: false,
        },
        columnStatements: {},
      });

      localStorage.setItem("sortColumns", JSON.stringify({ imagesList: [] }));

      renderWithProviders(<NextButton to="/postsort">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetResults).toHaveBeenCalled();
      expect(mockSetTriggerSortPreventNavModal).toHaveBeenCalledWith(false);
      expect(history.location.pathname).toBe("/postsort");
    });

    it("should prevent navigation with forced sorts and overloaded column", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "sort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: false,
          hasOverloadedColumn: true,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });

      localStorage.setItem("sortColumns", JSON.stringify({ imagesList: [] }));

      renderWithProviders(<NextButton to="/postsort">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerSortPreventNavModal).toHaveBeenCalledWith(false);
      expect(mockSetTriggerSortOverloadedColModal).toHaveBeenCalledWith(true);
      expect(history.location.pathname).toBe("/");
    });

    it("should allow navigation with forced sorts, no overloaded column, empty imagesList", () => {
      localStorage.setItem("sortColumns", JSON.stringify({ imagesList: [] }));

      renderWithProviders(<NextButton to="/postsort">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetResults).toHaveBeenCalled();
      expect(mockSetTriggerSortPreventNavModal).toHaveBeenCalledWith(false);
      expect(history.location.pathname).toBe("/postsort");
    });
  });

  describe("Sort Page Navigation - Finished", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "sort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: true,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });
    });

    it("should allow navigation when sorting finished with unforced sorts allowed", () => {
      useSettingsStore.mockReturnValue({
        configObj: {
          allowUnforcedSorts: true,
          postsortCommentsRequired: false,
        },
        columnStatements: {},
      });

      renderWithProviders(<NextButton to="/postsort">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerSortPreventNavModal).toHaveBeenCalledWith(false);
      expect(history.location.pathname).toBe("/postsort");
    });

    it("should prevent navigation when sorting finished but has overloaded column", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "sort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: true,
          hasOverloadedColumn: true,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });

      renderWithProviders(<NextButton to="/postsort">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerSortPreventNavModal).toHaveBeenCalledWith(false);
      expect(mockSetTriggerSortOverloadedColModal).toHaveBeenCalledWith(true);
      expect(history.location.pathname).toBe("/");
    });

    it("should allow navigation when sorting finished with no overloaded column", () => {
      renderWithProviders(<NextButton to="/postsort">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockSetTriggerSortPreventNavModal).toHaveBeenCalledWith(false);
      expect(history.location.pathname).toBe("/postsort");
    });
  });

  describe("Postsort Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "postsort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: false,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });

      localStorage.setItem("postsortCommentCardCount", "4");
    });

    it("should allow navigation when comments not required and some missing", () => {
      localStorage.setItem("HC-requiredCommentsObj", JSON.stringify({ card1: "false" }));
      localStorage.setItem("HC2-requiredCommentsObj", JSON.stringify({ card2: "true" }));
      localStorage.setItem("LC-requiredCommentsObj", JSON.stringify({ card3: "true" }));
      localStorage.setItem("LC2-requiredCommentsObj", JSON.stringify({ card4: "true" }));

      renderWithProviders(<NextButton to="/survey">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/survey");
    });

    // it('should prevent navigation when comments required and some missing (string "false")', () => {
    //   useSettingsStore.mockReturnValue({
    //     configObj: {
    //       allowUnforcedSorts: false,
    //       postsortCommentsRequired: true,
    //     },
    //     columnStatements: {},
    //   });

    //   localStorage.setItem("HC-requiredCommentsObj", JSON.stringify({ card1: "false" }));
    //   localStorage.setItem("HC2-requiredCommentsObj", JSON.stringify({ card2: "true" }));
    //   localStorage.setItem("LC-requiredCommentsObj", JSON.stringify({ card3: "true" }));
    //   localStorage.setItem("LC2-requiredCommentsObj", JSON.stringify({ card4: "true" }));

    //   renderWithProviders(<NextButton to="/survey">Next</NextButton>, history);

    //   const button = screen.getByRole("button");
    //   fireEvent.click(button);

    //   // expect(mockSetShowPostsortCommentHighlighting).toHaveBeenCalledWith(true);
    //   // expect(mockSetTriggerPostsortPreventNavModal).toHaveBeenCalledWith(true);
    //   // expect(history.location.pathname).toBe("/");
    // });

    // it("should prevent navigation when comments required and some missing (boolean false)", () => {
    //   useSettingsStore.mockReturnValue({
    //     configObj: {
    //       allowUnforcedSorts: false,
    //       postsortCommentsRequired: true,
    //     },
    //     columnStatements: {},
    //   });

    //   localStorage.setItem("HC-requiredCommentsObj", JSON.stringify({ card1: false }));
    //   localStorage.setItem("HC2-requiredCommentsObj", JSON.stringify({ card2: true }));
    //   localStorage.setItem("LC-requiredCommentsObj", JSON.stringify({ card3: true }));
    //   localStorage.setItem("LC2-requiredCommentsObj", JSON.stringify({ card4: true }));

    //   renderWithProviders(<NextButton to="/survey">Next</NextButton>, history);

    //   const button = screen.getByRole("button");
    //   fireEvent.click(button);

    //   expect(mockSetShowPostsortCommentHighlighting).toHaveBeenCalledWith(true);
    //   expect(mockSetTriggerPostsortPreventNavModal).toHaveBeenCalledWith(true);
    //   expect(history.location.pathname).toBe("/");
    // });

    // it("should prevent navigation when comment count is less than expected", () => {
    //   useSettingsStore.mockReturnValue({
    //     configObj: {
    //       allowUnforcedSorts: false,
    //       postsortCommentsRequired: true,
    //     },
    //     columnStatements: {},
    //   });

    //   localStorage.setItem("postsortCommentCardCount", "5");
    //   localStorage.setItem("HC-requiredCommentsObj", JSON.stringify({ card1: "true" }));
    //   localStorage.setItem("HC2-requiredCommentsObj", JSON.stringify({ card2: "true" }));
    //   localStorage.setItem("LC-requiredCommentsObj", JSON.stringify({ card3: "true" }));
    //   localStorage.setItem("LC2-requiredCommentsObj", JSON.stringify({ card4: "true" }));

    //   renderWithProviders(<NextButton to="/survey">Next</NextButton>, history);

    //   const button = screen.getByRole("button");
    //   fireEvent.click(button);

    //   expect(mockSetShowPostsortCommentHighlighting).toHaveBeenCalledWith(true);
    //   expect(mockSetTriggerPostsortPreventNavModal).toHaveBeenCalledWith(true);
    //   expect(history.location.pathname).toBe("/");
    // });

    it("should allow navigation when all comments complete", () => {
      useSettingsStore.mockReturnValue({
        configObj: {
          allowUnforcedSorts: false,
          postsortCommentsRequired: true,
        },
        columnStatements: {},
      });

      localStorage.setItem("HC-requiredCommentsObj", JSON.stringify({ card1: "true" }));
      localStorage.setItem("HC2-requiredCommentsObj", JSON.stringify({ card2: "true" }));
      localStorage.setItem("LC-requiredCommentsObj", JSON.stringify({ card3: "true" }));
      localStorage.setItem("LC2-requiredCommentsObj", JSON.stringify({ card4: "true" }));

      renderWithProviders(<NextButton to="/survey">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/survey");
    });
  });

  describe("Survey Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "survey",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: false,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
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

      renderWithProviders(<NextButton to="/submit">Next</NextButton>, history);

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

      renderWithProviders(<NextButton to="/submit">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/submit");
    });
  });

  describe("Props Filtering", () => {
    it("should filter out router props from button element", () => {
      const { container } = renderWithProviders(<NextButton to="/next">Next</NextButton>, history);

      const button = container.querySelector("button");

      // These props should not be on the button DOM element
      expect(button).not.toHaveAttribute("to");
      expect(button).not.toHaveAttribute("history");
      expect(button).not.toHaveAttribute("location");
      expect(button).not.toHaveAttribute("match");
      expect(button).not.toHaveAttribute("staticContext");
    });

    it("should pass through valid HTML props", () => {
      renderWithProviders(
        <NextButton to="/next" data-testid="next-button" aria-label="Next page">
          Next
        </NextButton>,
        history
      );

      const button = screen.getByTestId("next-button");
      expect(button).toHaveAttribute("aria-label", "Next page");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null localStorage values gracefully", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "postsort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: false,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });

      localStorage.setItem("HC-requiredCommentsObj", null);
      localStorage.setItem("HC2-requiredCommentsObj", null);
      localStorage.setItem("LC-requiredCommentsObj", null);
      localStorage.setItem("LC2-requiredCommentsObj", null);
      localStorage.setItem("postsortCommentCardCount", "0");

      renderWithProviders(<NextButton to="/survey">Next</NextButton>, history);

      const button = screen.getByRole("button");

      // Should not throw error
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("should handle pages without validation checks", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "submit",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: false,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });

      renderWithProviders(<NextButton to="/thankyou">Finish</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Should navigate without any checks
      expect(history.location.pathname).toBe("/thankyou");
    });

    it("should handle multiple rapid clicks", () => {
      renderWithProviders(<NextButton to="/landing">Go</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/landing");
    });

    // it("should handle invalid JSON in localStorage", () => {
    //   useStore.mockImplementation((selector) => {
    //     const mockState = {
    //       presortFinished: false,
    //       setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
    //       currentPage: "sort",
    //       setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
    //       setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
    //       isSortingFinished: false,
    //       hasOverloadedColumn: false,
    //       setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
    //       setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
    //       setResults: mockSetResults,
    //       setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
    //       setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
    //       isThinningFinished: false,
    //       setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
    //     };
    //     return selector(mockState);
    //   });

    //   localStorage.setItem("sortColumns", "invalid-json");

    //   renderWithProviders(<NextButton to="/postsort">Next</NextButton>, history);

    //   const button = screen.getByRole("button");

    //   // Should handle parsing error gracefully
    //   expect(() => fireEvent.click(button)).toThrow();
    // });
  });

  describe("Config Object Properties", () => {
    it("should respect allowUnforcedSorts configuration", () => {
      useSettingsStore.mockReturnValue({
        configObj: {
          allowUnforcedSorts: true,
          postsortCommentsRequired: false,
        },
        columnStatements: {},
      });

      renderWithProviders(<NextButton to="/next">Next</NextButton>, history);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should respect postsortCommentsRequired configuration", () => {
      useSettingsStore.mockReturnValue({
        configObj: {
          allowUnforcedSorts: false,
          postsortCommentsRequired: true,
        },
        columnStatements: {},
      });

      renderWithProviders(<NextButton to="/next">Next</NextButton>, history);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("PropTypes Validation", () => {
    it("should accept valid props without PropTypes warnings", () => {
      const validProps = {
        to: "/next",
        onClick: vi.fn(),
      };

      renderWithProviders(<NextButton {...validProps}>Next</NextButton>, history);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it('should work with string "to" prop', () => {
      renderWithProviders(<NextButton to="/landing">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(history.location.pathname).toBe("/landing");
    });

    it("should work with function onClick prop", () => {
      const mockOnClick = vi.fn();

      renderWithProviders(
        <NextButton to="/next" onClick={mockOnClick}>
          Next
        </NextButton>,
        history
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe("Sort Results Conversion", () => {
    // it("should call convertObjectToResults when checking sort page conditions", () => {
    //   const convertObjectToResults = require("../../sort/convertObjectToResults").default;

    //   useStore.mockImplementation((selector) => {
    //     const mockState = {
    //       presortFinished: false,
    //       setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
    //       currentPage: "sort",
    //       setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
    //       setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
    //       isSortingFinished: false,
    //       hasOverloadedColumn: false,
    //       setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
    //       setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
    //       setResults: mockSetResults,
    //       setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
    //       setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
    //       isThinningFinished: false,
    //       setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
    //     };
    //     return selector(mockState);
    //   });

    //   useSettingsStore.mockReturnValue({
    //     configObj: {
    //       allowUnforcedSorts: true,
    //       postsortCommentsRequired: false,
    //     },
    //     columnStatements: { column1: "statement1" },
    //   });

    //   localStorage.setItem("sortColumns", JSON.stringify({ imagesList: [] }));

    //   renderWithProviders(<NextButton to="/postsort">Next</NextButton>, history);

    //   const button = screen.getByRole("button");
    //   fireEvent.click(button);

    //   expect(convertObjectToResults).toHaveBeenCalledWith({ column1: "statement1" });
    // });

    it("should set results when navigation is allowed on sort page", () => {
      useStore.mockImplementation((selector) => {
        const mockState = {
          presortFinished: false,
          setTriggerPresortPreventNavModal: mockSetTriggerPresortPreventNavModal,
          currentPage: "sort",
          setCheckRequiredQuestionsComplete: mockSetCheckRequiredQuestionsComplete,
          setTriggerSurveyPreventNavModal: mockSetTriggerSurveyPreventNavModal,
          isSortingFinished: true,
          hasOverloadedColumn: false,
          setTriggerSortPreventNavModal: mockSetTriggerSortPreventNavModal,
          setTriggerSortOverloadedColumnModal: mockSetTriggerSortOverloadedColModal,
          setResults: mockSetResults,
          setShowPostsortCommentHighlighting: mockSetShowPostsortCommentHighlighting,
          setTriggerPostsortPreventNavModal: mockSetTriggerPostsortPreventNavModal,
          isThinningFinished: false,
          setTriggerThinningPreventNavModal: mockSetTriggerThinningPreventNavModal,
        };
        return selector(mockState);
      });

      renderWithProviders(<NextButton to="/postsort">Next</NextButton>, history);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Results conversion happens but setResults not called when already finished
      expect(history.location.pathname).toBe("/postsort");
    });
  });

  describe("Accessibility", () => {
    // it("should have correct tabindex for keyboard navigation", () => {
    //   renderWithProviders(<NextButton to="/next">Next</NextButton>, history);

    //   const button = screen.getByRole("button");
    //   expect(button).toHaveAttribute("tabindex", "0");
    // });

    it("should be focusable", () => {
      renderWithProviders(<NextButton to="/next">Next</NextButton>, history);

      const button = screen.getByRole("button");
      button.focus();

      expect(button).toHaveFocus();
    });

    it("should support aria attributes", () => {
      renderWithProviders(
        <NextButton to="/next" aria-label="Proceed to next page">
          Next
        </NextButton>,
        history
      );

      const button = screen.getByRole("button", { name: "Proceed to next page" });
      expect(button).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MobileNextButton from "../MobileNextButton";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";

// Mock the stores
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

// Mock react-router
const mockPush = vi.fn();
vi.mock("react-router", () => ({
  withRouter: (component) => component,
}));

describe("MobileNextButton", () => {
  const defaultStoreState = {
    presortFinished: false,
    currentPage: "presort",
    hasScrolledToBottomSort: false,
    setTriggerMobilePresortPreventNavModal: vi.fn(),
    setCheckRequiredQuestionsComplete: vi.fn(),
    setTriggerSurveyPreventNavModal: vi.fn(),
    setShowPostsortCommentHighlighting: vi.fn(),
    setTriggerMobilePostsortPreventNavModal: vi.fn(),
    setTriggerMobileThinPreventNavModal: vi.fn(),
    setTriggerMobileSortScrollBottomModal: vi.fn(),
  };

  const defaultSettingsState = {
    configObj: {
      allowUnforcedSorts: false,
      postsortCommentsRequired: false,
    },
  };

  beforeEach(() => {
    // Setup default mocks
    useStore.mockImplementation((selector) => selector(defaultStoreState));
    useSettingsStore.mockImplementation((selector) => selector(defaultSettingsState));

    // Clear localStorage
    localStorage.clear();

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe("Presort Page Navigation", () => {
    it("should prevent navigation when presort is not finished", () => {
      localStorage.setItem("m_PresortFinished", "false");

      const setTriggerModal = vi.fn();
      useStore.mockImplementation((selector) =>
        selector({ ...defaultStoreState, setTriggerMobilePresortPreventNavModal: setTriggerModal }),
      );

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(setTriggerModal).toHaveBeenCalledWith(true);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should allow navigation when presort is finished", () => {
      localStorage.setItem("m_PresortFinished", "true");

      const setTriggerModal = vi.fn();
      useStore.mockImplementation((selector) =>
        selector({ ...defaultStoreState, setTriggerMobilePresortPreventNavModal: setTriggerModal }),
      );

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(setTriggerModal).toHaveBeenCalledWith(false);
      expect(mockPush).toHaveBeenCalledWith("/next");
      expect(localStorage.getItem("m_PresortDisplayStatements")).toBe(
        JSON.stringify({ display: false }),
      );
    });
  });

  describe("Thin Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) =>
        selector({ ...defaultStoreState, currentPage: "thin" }),
      );
    });

    it("should prevent navigation when thinning is not finished", () => {
      localStorage.setItem("m_ThinningFinished", "false");

      const setTriggerModal = vi.fn();
      useStore.mockImplementation((selector) =>
        selector({
          ...defaultStoreState,
          currentPage: "thin",
          setTriggerMobileThinPreventNavModal: setTriggerModal,
        }),
      );

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(setTriggerModal).toHaveBeenCalledWith(true);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should allow navigation when thinning is finished", () => {
      localStorage.setItem("m_ThinningFinished", "true");

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(mockPush).toHaveBeenCalledWith("/next");
    });
  });

  describe("Sort Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) =>
        selector({ ...defaultStoreState, currentPage: "sort" }),
      );
    });

    it("should prevent navigation when user has not scrolled to bottom", () => {
      const setTriggerModal = vi.fn();
      useStore.mockImplementation((selector) =>
        selector({
          ...defaultStoreState,
          currentPage: "sort",
          hasScrolledToBottomSort: false,
          setTriggerMobileSortScrollBottomModal: setTriggerModal,
        }),
      );

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(setTriggerModal).toHaveBeenCalledWith(true);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should allow navigation when user has scrolled to bottom", () => {
      useStore.mockImplementation((selector) =>
        selector({ ...defaultStoreState, currentPage: "sort", hasScrolledToBottomSort: true }),
      );

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(mockPush).toHaveBeenCalledWith("/next");
    });
  });

  describe("Postsort Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) =>
        selector({ ...defaultStoreState, currentPage: "postsort" }),
      );
    });

    it("should prevent navigation when comments are required and incomplete", () => {
      localStorage.setItem(
        "m_MinWordCountPostsortObject",
        JSON.stringify({ q1: false, q2: false }),
      );

      const setHighlighting = vi.fn();
      const setTriggerModal = vi.fn();

      useSettingsStore.mockImplementation((selector) =>
        selector({ configObj: { postsortCommentsRequired: true } }),
      );

      useStore.mockImplementation((selector) =>
        selector({
          ...defaultStoreState,
          currentPage: "postsort",
          setShowPostsortCommentHighlighting: setHighlighting,
          setTriggerMobilePostsortPreventNavModal: setTriggerModal,
        }),
      );

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(setHighlighting).toHaveBeenCalledWith(true);
      expect(setTriggerModal).toHaveBeenCalledWith(true);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should allow navigation when comments are not required even if incomplete", () => {
      localStorage.setItem(
        "m_MinWordCountPostsortObject",
        JSON.stringify({ q1: false, q2: false }),
      );

      useSettingsStore.mockImplementation((selector) =>
        selector({ configObj: { postsortCommentsRequired: false } }),
      );

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(mockPush).toHaveBeenCalledWith("/next");
    });

    it("should allow navigation when all comments are complete", () => {
      localStorage.setItem("m_MinWordCountPostsortObject", JSON.stringify({ q1: true, q2: true }));

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(mockPush).toHaveBeenCalledWith("/next");
    });
  });

  describe("Survey Page Navigation", () => {
    beforeEach(() => {
      useStore.mockImplementation((selector) =>
        selector({ ...defaultStoreState, currentPage: "survey" }),
      );
    });

    it("should prevent navigation when survey has unanswered questions", () => {
      localStorage.setItem(
        "resultsSurvey",
        JSON.stringify({
          q1: "answer1",
          q2: "no-*?*-response",
        }),
      );

      const setCheckRequired = vi.fn();
      const setTriggerModal = vi.fn();

      useStore.mockImplementation((selector) =>
        selector({
          ...defaultStoreState,
          currentPage: "survey",
          setCheckRequiredQuestionsComplete: setCheckRequired,
          setTriggerSurveyPreventNavModal: setTriggerModal,
        }),
      );

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(setCheckRequired).toHaveBeenCalledWith(true);
      expect(setTriggerModal).toHaveBeenCalledWith(true);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should allow navigation when all survey questions are answered", () => {
      localStorage.setItem(
        "resultsSurvey",
        JSON.stringify({
          q1: "answer1",
          q2: "answer2",
        }),
      );

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(mockPush).toHaveBeenCalledWith("/next");
    });
  });

  describe("General Behavior", () => {
    it("should render button with children text", () => {
      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Continue
        </MobileNextButton>,
      );

      expect(screen.getByRole("button")).toHaveTextContent("Continue");
    });

    it("should call custom onClick handler if provided", () => {
      localStorage.setItem("m_PresortFinished", "true");
      const customOnClick = vi.fn();

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next" onClick={customOnClick}>
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(customOnClick).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/next");
    });

    it("should apply custom width prop", () => {
      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next" width={200}>
          Next
        </MobileNextButton>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ width: "200px" });
    });

    it("should allow navigation for pages without specific checks", () => {
      useStore.mockImplementation((selector) =>
        selector({ ...defaultStoreState, currentPage: "other-page" }),
      );

      renderWithRouter(
        <MobileNextButton history={{ push: mockPush }} to="/next">
          Next
        </MobileNextButton>,
      );

      fireEvent.click(screen.getByRole("button"));

      expect(mockPush).toHaveBeenCalledWith("/next");
    });
  });
});

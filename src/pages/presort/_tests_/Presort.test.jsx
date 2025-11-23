import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PresortPage from "../Presort";
import useSettingsStore from "../../../globalState/useSettingsStore";
import useStore from "../../../globalState/useStore";
import calculateTimeOnPage from "../../../utilities/calculateTimeOnPage";

// Mock all dependencies
vi.mock("./PresortModal", () => ({
  default: () => <div data-testid="presort-modal">PresortModal</div>,
}));

vi.mock("../PresortDND", () => ({
  default: ({ statements, cardFontSize }) => (
    <div data-testid="presort-dnd">
      PresortDND - Font: {cardFontSize} - Statements: {statements.length}
    </div>
  ),
}));

vi.mock("../PresortDndImages", () => ({
  default: ({ cardFontSize }) => (
    <div data-testid="presort-dnd-images">PresortDndImages - Font: {cardFontSize}</div>
  ),
}));

vi.mock("../PresortPreventNavModal", () => ({
  default: () => <div data-testid="prevent-nav-modal">PreventNavModal</div>,
}));

vi.mock("../PresortFinishedModal", () => ({
  default: () => <div data-testid="finished-modal">FinishedModal</div>,
}));

vi.mock("../PresortIsComplete", () => ({
  default: () => <div data-testid="presort-complete">Presort Is Complete</div>,
}));

vi.mock("../PleaseLogInFirst", () => ({
  default: () => <div data-testid="please-login">Please Log In First</div>,
}));

vi.mock("../../../utilities/PromptUnload", () => ({
  default: () => <div data-testid="prompt-unload">PromptUnload</div>,
}));

vi.mock("../../../utilities/calculateTimeOnPage");
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../globalState/useStore");

describe("PresortPage", () => {
  const mockSetCurrentPage = vi.fn();
  const mockSetProgressScore = vi.fn();
  const mockSetDisplayNextButton = vi.fn();

  const defaultLangObj = {
    titleBarText: "Test Title Bar",
  };

  const defaultConfigObj = {
    headerBarColor: "#3498db",
    initialScreen: "anonymous",
    setupTarget: "remote",
    useImages: false,
  };

  const defaultStatementsObj = {
    columnStatements: {
      statementList: [
        { id: 1, text: "Statement 1" },
        { id: 2, text: "Statement 2" },
        { id: 3, text: "Statement 3" },
      ],
    },
  };

  const setupMocks = (overrides = {}) => {
    const config = {
      langObj: defaultLangObj,
      configObj: defaultConfigObj,
      statementsObj: defaultStatementsObj,
      isLoggedIn: true,
      presortNoReturn: false,
      resetColumnStatements: defaultStatementsObj.columnStatements,
      ...overrides,
    };

    vi.mocked(useSettingsStore).mockImplementation((selector) => {
      const state = {
        langObj: config.langObj,
        configObj: config.configObj,
        statementsObj: config.statementsObj,
        isLoggedIn: config.isLoggedIn,
        resetColumnStatements: config.resetColumnStatements,
      };
      return selector(state);
    });

    vi.mocked(useStore).mockImplementation((selector) => {
      const state = {
        cardFontSizePresort: 16,
        setCurrentPage: mockSetCurrentPage,
        setProgressScore: mockSetProgressScore,
        presortNoReturn: config.presortNoReturn,
        setDisplayNextButton: mockSetDisplayNextButton,
      };
      return selector(state);
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Component Rendering", () => {
    it("should render the main presort page with all modals", () => {
      setupMocks();
      render(<PresortPage />);

      expect(screen.getByTestId("prompt-unload")).toBeInTheDocument();
      // expect(screen.getByTestId("presort-modal")).toBeInTheDocument();
      expect(screen.getByTestId("finished-modal")).toBeInTheDocument();
      expect(screen.getByTestId("prevent-nav-modal")).toBeInTheDocument();
    });

    it("should render title bar with correct text and color", () => {
      setupMocks();
      render(<PresortPage />);

      const titleBar = screen.getByText("Test Title Bar");
      expect(titleBar).toBeInTheDocument();
      expect(titleBar).toHaveStyle({ backgroundColor: "#3498db" });
    });

    it("should render PresortDND when useImages is false", () => {
      setupMocks();
      render(<PresortPage />);

      expect(screen.getByTestId("presort-dnd")).toBeInTheDocument();
      expect(screen.queryByTestId("presort-dnd-images")).not.toBeInTheDocument();
    });

    it("should render PresortDndImages when useImages is true", () => {
      setupMocks({
        configObj: { ...defaultConfigObj, useImages: true },
      });
      render(<PresortPage />);

      expect(screen.getByTestId("presort-dnd-images")).toBeInTheDocument();
      expect(screen.queryByTestId("presort-dnd")).not.toBeInTheDocument();
    });

    it("should parse HTML in title bar text", () => {
      setupMocks({
        langObj: { titleBarText: "<strong>Bold Title</strong>" },
      });
      render(<PresortPage />);

      expect(screen.getByText("Bold Title")).toBeInTheDocument();
    });
  });

  describe("Authentication Checks", () => {
    it("should show PleaseLogInFirst when not logged in and initialScreen is not anonymous", () => {
      setupMocks({
        configObj: { ...defaultConfigObj, initialScreen: "login" },
        isLoggedIn: false,
      });
      render(<PresortPage />);

      expect(screen.getByTestId("please-login")).toBeInTheDocument();
      expect(screen.queryByTestId("presort-dnd")).not.toBeInTheDocument();
    });

    it("should render normally when logged in", () => {
      setupMocks({
        configObj: { ...defaultConfigObj, initialScreen: "login" },
        isLoggedIn: true,
      });
      render(<PresortPage />);

      expect(screen.queryByTestId("please-login")).not.toBeInTheDocument();
      expect(screen.getByTestId("presort-dnd")).toBeInTheDocument();
    });

    it("should render normally when initialScreen is anonymous", () => {
      setupMocks({
        configObj: { ...defaultConfigObj, initialScreen: "anonymous" },
        isLoggedIn: false,
      });
      render(<PresortPage />);

      expect(screen.queryByTestId("please-login")).not.toBeInTheDocument();
      expect(screen.getByTestId("presort-dnd")).toBeInTheDocument();
    });
  });

  describe("Presort Completion Check", () => {
    it("should show PresortIsComplete when presortNoReturn is true", () => {
      setupMocks({ presortNoReturn: true });
      render(<PresortPage />);

      expect(screen.getByTestId("presort-complete")).toBeInTheDocument();
      expect(screen.queryByTestId("presort-dnd")).not.toBeInTheDocument();
    });

    it("should render normally when presortNoReturn is false", () => {
      setupMocks({ presortNoReturn: false });
      render(<PresortPage />);

      expect(screen.queryByTestId("presort-complete")).not.toBeInTheDocument();
      expect(screen.getByTestId("presort-dnd")).toBeInTheDocument();
    });
  });

  describe("Font Size Handling", () => {
    it("should use default card font size from store", () => {
      setupMocks();
      render(<PresortPage />);

      expect(screen.getByText(/Font: 16/)).toBeInTheDocument();
    });

    it("should use persisted font size from localStorage if available", () => {
      localStorage.setItem("fontSizePresort", "20");
      setupMocks();
      render(<PresortPage />);

      expect(screen.getByText(/Font: 20/)).toBeInTheDocument();
    });
  });

  describe("Lifecycle and Effects", () => {
    // it("should set current page and progress on mount", async () => {
    //   setupMocks();
    //   render(<PresortPage />);

    //   await waitFor(() => {
    //     expect(mockSetCurrentPage).toHaveBeenCalledWith("presort");
    //     expect(mockSetProgressScore).toHaveBeenCalledWith(15);
    //   });
    // });

    // it("should set currentPage in localStorage on mount", async () => {
    //   setupMocks();
    //   render(<PresortPage />);

    //   await waitFor(() => {
    //     expect(localStorage.getItem("currentPage")).toBe("presort");
    //   });
    // });

    it("should set display next button to true", () => {
      setupMocks();
      render(<PresortPage />);

      expect(mockSetDisplayNextButton).toHaveBeenCalledWith(true);
    });

    it("should calculate time on page on unmount", () => {
      setupMocks();
      const { unmount } = render(<PresortPage />);

      const startTime = Date.now();
      vi.advanceTimersByTime(5000);

      unmount();

      expect(calculateTimeOnPage).toHaveBeenCalledWith(
        expect.any(Number),
        "presortPage",
        "presortPage"
      );
    });
  });

  describe("Local Setup Handling", () => {
    it("should use resetColumnStatements when setupTarget is local", () => {
      const resetStatements = {
        statementList: [
          { id: 10, text: "Reset Statement 1" },
          { id: 11, text: "Reset Statement 2" },
        ],
      };

      setupMocks({
        configObj: { ...defaultConfigObj, setupTarget: "local" },
        resetColumnStatements: resetStatements,
      });

      render(<PresortPage />);

      // Should show 2 statements from resetColumnStatements
      expect(screen.getByText(/Statements: 2/)).toBeInTheDocument();
    });

    it("should use statementsObj.columnStatements when setupTarget is not local", () => {
      setupMocks({
        configObj: { ...defaultConfigObj, setupTarget: "remote" },
      });

      render(<PresortPage />);

      // Should show 3 statements from default statementsObj
      expect(screen.getByText(/Statements: 3/)).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty titleBarText", () => {
      setupMocks({
        langObj: { titleBarText: "" },
      });
      render(<PresortPage />);

      // Component should still render without errors
      expect(screen.getByTestId("presort-dnd")).toBeInTheDocument();
    });

    it("should handle undefined titleBarText", () => {
      setupMocks({
        langObj: {},
      });
      render(<PresortPage />);

      // Component should still render without errors
      expect(screen.getByTestId("presort-dnd")).toBeInTheDocument();
    });

    it("should handle empty statements array", () => {
      setupMocks({
        statementsObj: {
          columnStatements: {
            statementList: [],
          },
        },
      });
      render(<PresortPage />);

      expect(screen.getByText(/Statements: 0/)).toBeInTheDocument();
    });
  });
});

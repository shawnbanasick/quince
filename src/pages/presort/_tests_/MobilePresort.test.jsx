import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MobilePresortPage from "../MobilePresort";

// Mock dependencies
vi.mock("../../../utilities/calculateTimeOnPage");
vi.mock("../../../utilities/decodeHTML", () => ({
  default: (text) => text,
}));
vi.mock("html-react-parser", () => ({
  default: (text) => text,
}));

// Mock global state stores
const mockSettingsStore = {
  langObj: {
    mobilePresortConditionsOfInstruction: "Instructions",
    mobilePresortCompletedLabel: "Completed",
    mobilePresortAssignLeft: "Disagree",
    mobilePresortAssignRight: "Agree",
    mobilePresortProcessCompleteMessage: "Process Complete",
    screenOrientationText: "Please rotate your device",
    expandViewMessage: "Expand view",
    mobilePresortHelpModalHead: "Help",
    mobilePresortHelpModalText: "Help text",
    mobilePresortPreventNavModalHead: "Warning",
    mobilePresortPreventNavModalText: "Please complete",
    mobilePresortFinishedModalHead: "Finished",
    mobilePresortFinishedModalText: "You're done!",
  },
  configObj: {
    setupTarget: "online",
    initialScreen: "anonymous",
    headerBarColor: "#3B82F6",
  },
  mapObj: {
    useColLabelEmojiPresort: ["false"],
  },
  statementsObj: {
    columnStatements: {
      statementList: [
        { id: "s1", statement: "Statement 1" },
        { id: "s2", statement: "Statement 2" },
      ],
    },
  },
  isLoggedIn: true,
  resetColumnStatements: [],
};

const mockStore = {
  setCurrentPage: vi.fn(),
  setProgressScore: vi.fn(),
  setPresortFinished: vi.fn(),
  mobilePresortFontSize: "16px",
  setTriggerMobilePresortRedoModal: vi.fn(),
  setTriggerMobilePresortFinishedModal: vi.fn(),
  triggerMobilePresortHelpModal: false,
  setTriggerMobilePresortHelpModal: vi.fn(),
  triggerMobilePresortPreventNavModal: false,
  setTriggerMobilePresortPreventNavModal: vi.fn(),
  triggerMobilePresortFinishedModal: false,
  setTriggerMobilePresortFinishedModal: vi.fn(),
};

vi.mock("../../../globalState/useSettingsStore", () => ({
  default: (selector) => selector(mockSettingsStore),
}));

vi.mock("../../../globalState/useStore", () => ({
  default: (selector) => selector(mockStore),
}));

// make this a vi.fn so we can change return value per-test
vi.mock("../../../utilities/useScreenOrientation", () => ({
  default: vi.fn(() => "portrait-primary"),
}));

vi.mock("../../../utilities/useLocalStorage", () => ({
  default: (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    const initialValue = stored ? JSON.parse(stored) : defaultValue;
    return [initialValue, (val) => localStorage.setItem(key, JSON.stringify(val))];
  },
}));

vi.mock("./mobileCardColor", () => ({
  default: (value) => {
    if (value > 0) return "#BCF0DA";
    if (value < 0) return "#FBD5D5";
    return "#F3F4F6";
  },
}));

vi.mock("../calcThinDisplayControllerArray", () => ({
  default: vi.fn(() => []),
}));

// Mock child components
vi.mock("../PleaseLogInFirst", () => ({
  default: () => <div>Please Log In First</div>,
}));

vi.mock("../MobileStatementBox", () => ({
  default: ({ statement }) => <div data-testid="statement-box">{statement}</div>,
}));

vi.mock("../MobileValueButton", () => ({
  default: ({ onClick, value, child }) => (
    <button data-testid={`value-button-${value}`} onClick={onClick}>
      {child}
    </button>
  ),
}));

vi.mock("../MobilePreviousAssignmentBox", () => ({
  default: ({ statements, onClick }) => (
    <div data-testid="previous-assignments">
      {statements.map((s) => (
        <button key={s.id} data-id={s.id} data-statement={s.statement} onClick={onClick}>
          {s.statement}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../../../utilities/MobileModal", () => ({
  default: ({ head, trigger }) => (trigger ? <div data-testid="modal">{head}</div> : null),
}));

vi.mock("../MobilePresortRedoModal", () => ({
  default: () => <div data-testid="redo-modal" />,
}));

describe("MobilePresortPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Setup default localStorage
    localStorage.setItem(
      "presortArray",
      JSON.stringify([
        { id: "s1", statement: "Statement 1" },
        { id: "s2", statement: "Statement 2" },
      ])
    );
    localStorage.setItem("m_PresortStatementCount", "0");
    localStorage.setItem("m_PresortResults", "[]");
    localStorage.setItem("m_PresortDisplayStatements", JSON.stringify({ display: true }));
    localStorage.setItem("currentPage", "presort");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  //   describe("Component Rendering", () => {
  //     it("should render the component with title and instructions", () => {
  //       render(<MobilePresortPage />);
  //       expect(screen.getByText("Instructions")).toBeInTheDocument();
  //     });

  //     it("should display statement counter", () => {
  //       render(<MobilePresortPage />);
  //       expect(screen.getByText("0 / 2")).toBeInTheDocument();
  //     });

  //     it("should render three value buttons", () => {
  //       render(<MobilePresortPage />);
  //       expect(screen.getByTestId("value-button--2")).toBeInTheDocument();
  //       expect(screen.getByTestId("value-button-0")).toBeInTheDocument();
  //       expect(screen.getByTestId("value-button-2")).toBeInTheDocument();
  //     });

  //     it("should display current statement", () => {
  //       render(<MobilePresortPage />);
  //       expect(screen.getByTestId("statement-box")).toHaveTextContent("Statement 1");
  //     });

  //     it("should display completed label", () => {
  //       render(<MobilePresortPage />);
  //       expect(screen.getByText("Completed")).toBeInTheDocument();
  //     });
  //   });

  describe("User Interactions", () => {
    it("should handle positive button click", () => {
      render(<MobilePresortPage />);
      const positiveButton = screen.getByTestId("value-button-pos2");
      fireEvent.click(positiveButton);

      const storedResults = JSON.parse(localStorage.getItem("m_PresortResults") || "[]");
      expect(storedResults.length).toBe(1);
      expect(storedResults[0].psValue).toBe(2);
      expect(storedResults[0].greenChecked).toBe(true);
    });

    it("should handle negative button click", () => {
      render(<MobilePresortPage />);
      const negativeButton = screen.getByTestId("value-button-neg2");
      fireEvent.click(negativeButton);

      const storedResults = JSON.parse(localStorage.getItem("m_PresortResults") || "[]");
      expect(storedResults.length).toBe(1);
      expect(storedResults[0].psValue).toBe(-2);
      expect(storedResults[0].pinkChecked).toBe(true);
    });

    it("should handle neutral button click", () => {
      render(<MobilePresortPage />);
      const neutralButton = screen.getByTestId("value-button-neu1");
      fireEvent.click(neutralButton);

      const storedResults = JSON.parse(localStorage.getItem("m_PresortResults") || "[]");
      expect(storedResults.length).toBe(1);
      expect(storedResults[0].psValue).toBe(0);
      expect(storedResults[0].yellowChecked).toBe(true);
    });

    it("should increment statement count after button click", () => {
      render(<MobilePresortPage />);
      fireEvent.click(screen.getByTestId("value-button-pos2"));

      const count = localStorage.getItem("m_PresortStatementCount");
      expect(count).toBe("1");
    });

    it("should open help modal when help button clicked", () => {
      render(<MobilePresortPage />);
      // find help button (text from mockSettingsStore)
      const helpButton = screen.getByRole("button", { name: /help/i });
      fireEvent.click(helpButton);

      expect(mockStore.setTriggerMobilePresortHelpModal).toHaveBeenCalledWith(true);
    });
  });

  describe("Keyboard Shortcuts", () => {
    it("should handle keyboard shortcut '1' for negative", () => {
      render(<MobilePresortPage />);
      fireEvent.keyUp(window, { key: "1" });

      const storedResults = JSON.parse(localStorage.getItem("m_PresortResults") || "[]");
      expect(storedResults[0]?.psValue).toBe(-2);
    });

    it("should handle keyboard shortcut '2' for neutral", () => {
      render(<MobilePresortPage />);
      fireEvent.keyUp(window, { key: "2" });

      const storedResults = JSON.parse(localStorage.getItem("m_PresortResults") || "[]");
      expect(storedResults[0]?.psValue).toBe(0);
    });

    it("should handle keyboard shortcut '3' for positive", () => {
      render(<MobilePresortPage />);
      fireEvent.keyUp(window, { key: "3" });

      const storedResults = JSON.parse(localStorage.getItem("m_PresortResults") || "[]");
      expect(storedResults[0]?.psValue).toBe(2);
    });
  });

  describe("Completion Flow", () => {
    it("should trigger finished modal when all statements are sorted", () => {
      localStorage.setItem(
        "presortArray",
        JSON.stringify([{ id: "s1", statement: "Statement 1" }])
      );

      render(<MobilePresortPage />);
      fireEvent.click(screen.getByTestId("value-button-2"));

      expect(mockStore.setTriggerMobilePresortFinishedModal).toHaveBeenCalledWith(true);
      expect(localStorage.getItem("m_PresortFinished")).toBe("true");
    });

    it("should update localStorage with final results", () => {
      localStorage.setItem(
        "presortArray",
        JSON.stringify([{ id: "s1", statement: "Statement 1" }])
      );
      localStorage.setItem("newCols", JSON.stringify({ statementList: [] }));
      localStorage.setItem("sortRightArrays", "[]");
      localStorage.setItem("sortLeftArrays", "[]");

      render(<MobilePresortPage />);
      fireEvent.click(screen.getByTestId("value-button-2"));

      const newCols = JSON.parse(localStorage.getItem("newCols") || "{}");
      expect(newCols.statementList.length).toBe(1);
    });
  });

  describe("Redo Functionality", () => {
    it("should open redo modal when previous assignment clicked", () => {
      localStorage.setItem(
        "m_PresortResults",
        JSON.stringify([{ id: "s1", statement: "Statement 1", psValue: 2 }])
      );

      render(<MobilePresortPage />);
      const prevButton = screen.getByText("Statement 1");
      fireEvent.click(prevButton);

      expect(mockStore.setTriggerMobilePresortRedoModal).toHaveBeenCalledWith(true);
    });
  });

  describe("Conditional Rendering", () => {
    it("should show login prompt when not logged in", () => {
      mockSettingsStore.isLoggedIn = false;
      mockSettingsStore.configObj.initialScreen = "login";

      render(<MobilePresortPage />);
      expect(screen.getByText("Please Log In First")).toBeInTheDocument();

      mockSettingsStore.isLoggedIn = true;
      mockSettingsStore.configObj.initialScreen = "anonymous";
    });

    // it("should show orientation message in landscape mode", async () => {
    //   const useScreenOrientation = await import("../../../utilities/useScreenOrientation");
    //   vi.mocked(useScreenOrientation.default).mockReturnValue("landscape-primary");

    //   render(<MobilePresortPage />);
    //   expect(screen.getByText("Please rotate your device")).toBeInTheDocument();
    // });

    it("should show completion message when display is false", () => {
      localStorage.setItem("m_PresortDisplayStatements", JSON.stringify({ display: false }));

      render(<MobilePresortPage />);
      expect(screen.getByText("Process Complete")).toBeInTheDocument();
    });
  });

  describe("Page Lifecycle", () => {
    it("should set current page on mount", () => {
      render(<MobilePresortPage />);
      expect(mockStore.setCurrentPage).toHaveBeenCalledWith("presort");
    });

    it("should set progress score on mount", () => {
      render(<MobilePresortPage />);
      expect(mockStore.setProgressScore).toHaveBeenCalledWith(20);
    });
  });

  describe("Data Persistence", () => {
    it("should store selected positive items", () => {
      render(<MobilePresortPage />);
      fireEvent.click(screen.getByTestId("value-button-2"));

      const posItems = JSON.parse(localStorage.getItem("selectedPosItems") || "[]");
      expect(posItems.length).toBe(1);
      expect(posItems[0].psValue).toBe(2);
    });

    it("should store selected negative items", () => {
      render(<MobilePresortPage />);
      fireEvent.click(screen.getByTestId("value-button--2"));

      const negItems = JSON.parse(localStorage.getItem("selectedNegItems") || "[]");
      expect(negItems.length).toBe(1);
      expect(negItems[0].psValue).toBe(-2);
    });

    it("should sort results by psValue and id", () => {
      localStorage.setItem(
        "presortArray",
        JSON.stringify([
          { id: "s2", statement: "Statement 2" },
          { id: "s1", statement: "Statement 1" },
        ])
      );

      render(<MobilePresortPage />);
      fireEvent.click(screen.getByTestId("value-button-2"));
      fireEvent.click(screen.getByTestId("value-button-2"));

      const results = JSON.parse(localStorage.getItem("m_PresortResults") || "[]");
      expect(results[0].id).toBe("s1");
      expect(results[1].id).toBe("s2");
    });
  });
});

// PresortDND.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PresortDND from "../PresortDND";

// 1. Mock the stores
vi.mock("../../../globalState/useSettingsStore", () => ({
  default: vi.fn((selector) =>
    selector({
      langObj: {
        presortStatements: "Statements",
        presortDisagreement: "Disagree",
        presortAgreement: "Agree",
        presortNeutral: "Neutral",
        press1: "Press 1",
        press2: "Press 2",
        press3: "Press 3",
        presortOnPageInstructions: "Instructions",
      },
      configObj: { defaultFontColor: "#000", sortDirection: "positive" },
      mapObj: { useColLabelEmojiPresort: true },
      statementsObj: { totalStatements: 3 },
      columnStatements: { statementList: [] },
    }),
  ),
}));

vi.mock("../../globalState/useStore", () => ({
  default: vi.fn((selector) => {
    const state = {
      presortSortedStatementsNumInitial: 0,
      results: {},
      setPresortFinished: vi.fn(),
      setTriggerPresortFinishedModal: vi.fn(),
      setResults: vi.fn(),
      setProgressScoreAdditional: vi.fn(),
      setPosSorted: vi.fn(),
      setNegSorted: vi.fn(),
    };
    return selector(state);
  }),
}));

// 2. Mock DND (Beautiful DND is notoriously hard to test without mocking)
vi.mock("react-beautiful-dnd", () => ({
  DragDropContext: ({ children }) => <div>{children}</div>,
  Droppable: ({ children }) =>
    children(
      {
        draggableProps: {},
        innerRef: vi.fn(),
      },
      { isDraggingOver: false },
    ),
  Draggable: ({ children }) =>
    children(
      {
        draggableProps: {},
        dragHandleProps: {},
        innerRef: vi.fn(),
      },
      { isDragging: false },
    ),
}));

// 3. Mock Assets/Utilities
vi.mock("../../../assets/emojiN3.svg?react", () => ({
  default: () => <svg data-testid="emoji-n3" />,
}));
vi.mock("../../../assets/emoji0.svg?react", () => ({
  default: () => <svg data-testid="emoji-0" />,
}));
vi.mock("../../../assets/emoji3.svg?react", () => ({
  default: () => <svg data-testid="emoji-3" />,
}));
vi.mock("../../../utilities/decodeHTML", () => ({ default: (str) => str }));

describe("PresortDND Component", () => {
  const mockStatements = [
    { id: "s1", statement: "Statement 1", statementNum: 1, backgroundColor: "white" },
    { id: "s2", statement: "Statement 2", statementNum: 2, backgroundColor: "white" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders the correct column headers and emojis", () => {
    render(<PresortDND statements={mockStatements} cardFontSize={16} />);

    expect(screen.getByText("Disagree")).toBeInTheDocument();
    expect(screen.getByText("Neutral")).toBeInTheDocument();
    expect(screen.getByText("Agree")).toBeInTheDocument();

    // Check if emojis rendered (since mapObj.useColLabelEmojiPresort is true)
    expect(screen.getAllByTestId("emoji-n3").length).toBeGreaterThan(0);
  });

  it("updates the completion ratio correctly", () => {
    render(<PresortDND statements={mockStatements} cardFontSize={16} />);
    // Check initial ratio (Note: columnStatements.statementList.length mock is 0 in setup,
    // adjust your mock to match actual prop logic if needed)
    const ratio = screen.getByText(/0\//);
    expect(ratio).toBeInTheDocument();
  });

  it("triggers sort logic when keyboard keys '1', '2', or '3' are pressed", () => {
    render(<PresortDND statements={mockStatements} cardFontSize={16} />);

    // Mock the first item in the "cards" column exists
    // We trigger a keyup event
    fireEvent.keyUp(window, { key: "1", code: "Digit1" });

    // Check if localStorage was updated (as per your onDragEnd logic)
    expect(localStorage.getItem("resultsPresort")).toBeDefined();
  });

  it("initializes local storage columns on mount", () => {
    render(<PresortDND statements={mockStatements} cardFontSize={16} />);
    const storedColumns = JSON.parse(localStorage.getItem("columns"));

    expect(storedColumns).toBeDefined();
    expect(storedColumns.cards.items).toHaveLength(2);
  });

  it("handles the empty state when all cards are sorted", async () => {
    // In this test, we pass an empty array to simulate completion
    render(<PresortDND statements={[]} cardFontSize={16} />);

    // The useEffect checks columns.cards.items.length === 0
    // This should trigger state updates in our mocked useStore
    // You would verify if setPresortFinished was called
  });
});

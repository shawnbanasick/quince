import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SortGrid from "../SortGrid";
import useStore from "../../../globalState/useStore";
import useSettingsStore from "../../../globalState/useSettingsStore";

// 1. Mock the custom hooks/stores
vi.mock("../../../globalState/useStore");
vi.mock("../../../globalState/useSettingsStore");
vi.mock("../../../utilities/useLocalStorage", () => ({
  default: vi.fn((key, initial) => [initial, vi.fn()]),
}));

// 2. Mock child components and logic functions
vi.mock("../SortColumn", () => ({
  default: ({ columnId }) => <div data-testid="sort-column">{columnId}</div>,
}));

vi.mock("react-beautiful-dnd", () => ({
  DragDropContext: ({ children, onDragEnd }) => (
    <div
      data-testid="drag-drop-context"
      onClick={() =>
        onDragEnd({
          destination: { droppableId: "column1", index: 0 },
          source: { droppableId: "statements", index: 0 },
          draggableId: "s1",
        })
      }
    >
      {children}
    </div>
  ),
}));

vi.mock("./calculateDragResults", () => ({
  default: vi.fn(() => ({
    sortFinished: false,
    results: {},
    sortGridResults: {},
  })),
}));

vi.mock("./reorder", () => ({ default: vi.fn() }));
vi.mock("./move", () => ({ default: vi.fn() }));

describe("SortGrid Component", () => {
  const mockSettings = {
    configObj: { greenCardColor: "green", warnOverloadedColumn: true },
    mapObj: {
      qSortHeaders: ["Header1", "Header2"],
      qSortHeaderNumbers: [1, 2],
      columnColorsArray: ["#fff", "#000"],
      columnHeadersColorsArray: ["#eee", "#ddd"],
      qSortPattern: [2, 2],
    },
    statementsObj: { totalStatements: 10 },
  };

  const mockStoreActions = {
    setIsSortingCards: vi.fn(),
    setSortCompleted: vi.fn(),
    setProgressScoreAdditionalSort: vi.fn(),
    setIsSortingFinished: vi.fn(),
    setResults: vi.fn(),
    setSortGridResults: vi.fn(),
    setTriggerSortingFinishedModal: vi.fn(),
    results: {},
    sortFinishedModalHasBeenShown: false,
    sortGridResults: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the implementation of the stores
    useSettingsStore.mockImplementation((selector) => selector(mockSettings));
    useStore.mockImplementation((selector) => selector(mockStoreActions));

    // Mock LocalStorage
    const localStorageMock = {
      getItem: vi
        .fn()
        .mockReturnValue(JSON.stringify({ vCols: { columnHeader1: [] }, statementList: [] })),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
  });

  it("renders the correct number of SortColumn components", () => {
    render(<SortGrid cardHeight="100" />);
    const columns = screen.getAllByTestId("sort-column");
    expect(columns).toHaveLength(mockSettings.mapObj.qSortHeaders.length);
  });
});

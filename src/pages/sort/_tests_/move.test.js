import { describe, it, expect, vi, beforeEach } from "vitest";
import move from "../move";
import useStore from "../../../globalState/useStore";

// Mock the external dependencies
vi.mock("../../../globalState/useStore", () => ({
  default: {
    setState: vi.fn(),
  },
}));

vi.mock("../checkForColumnOverload", () => ({
  default: vi.fn(),
}));

describe("move function", () => {
  let defaultSortChars;
  let sourceArray;
  let destArray;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup standard mock data
    sourceArray = ["item1", "item2"];
    destArray = ["item3"];

    defaultSortChars = {
      qSortPattern: [1, 1],
      qSortHeaders: ["1", "2"],
      forcedSorts: true,
    };
  });

  it("should move an item from source to destination and update store", () => {
    const droppableSource = { index: 0, droppableId: "sourceCol" };
    const droppableDest = { index: 0, droppableId: "destCol" };
    const columnStatements = { vCols: { column1: [{}], column2: [{}] } };

    move(
      sourceArray,
      destArray,
      droppableSource,
      droppableDest,
      columnStatements,
      10,
      defaultSortChars,
      false,
      [],
    );

    // Verify item was moved in the arrays
    expect(destArray).toContain("item1");
    expect(sourceArray).not.toContain("item1");

    // Verify useStore.setState was called with the movement results
    expect(useStore.setState).toHaveBeenCalledWith(
      expect.objectContaining({ result: expect.any(Object) }),
    );
  });

  it("should set sortCompleted to true when pattern matches and allowUnforcedSorts is false", () => {
    const columnStatements = {
      vCols: { column1: ["a"], column2: ["b"] }, // Lengths match [1, 1]
      statementList: [],
    };

    move(
      sourceArray,
      destArray,
      { index: 0, droppableId: "s" },
      { index: 0, droppableId: "d" },
      columnStatements,
      2,
      defaultSortChars,
      false,
      [],
    );

    expect(useStore.setState).toHaveBeenCalledWith({ sortCompleted: true });
    expect(useStore.setState).toHaveBeenCalledWith({ isSortingFinished: true });
  });
});

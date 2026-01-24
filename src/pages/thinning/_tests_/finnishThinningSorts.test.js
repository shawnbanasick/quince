import { describe, it, expect, vi, beforeEach } from "vitest";
import finishThinningSorts from "../finishThinningSorts";
import shuffle from "lodash/shuffle";
import remove from "lodash/remove";

vi.mock("lodash/shuffle");
vi.mock("lodash/remove");

describe("finishThinningSorts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    shuffle.mockImplementation((arr) => [...arr]);
    remove.mockImplementation((arr, predicate) => {
      const removed = [];
      for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
          removed.push(...arr.splice(i, 1));
        }
      }
      return removed;
    });
  });

  it("should shuffle statementList at the start", () => {
    const newCols = {
      statementList: [{ id: 1, pinkChecked: false, yellowChecked: false, greenChecked: false }],
      vCols: { col1: [] },
    };
    const finalSortColData = [["col1", 5]];

    finishThinningSorts(newCols, finalSortColData);

    expect(shuffle).toHaveBeenCalledWith(newCols.statementList);
  });

  it("should distribute pink checked items to columns using unshift", () => {
    const newCols = {
      statementList: [
        { id: 1, pinkChecked: true, yellowChecked: false, greenChecked: false },
        { id: 2, pinkChecked: true, yellowChecked: false, greenChecked: false },
      ],
      vCols: { col1: [], col2: [] },
    };
    const finalSortColData = [
      ["col1", 2],
      ["col2", 2],
    ];

    const result = finishThinningSorts(newCols, finalSortColData);

    expect(result.vCols.col1.length).toBeGreaterThan(0);
    expect(result.statementList.length).toBe(0);
  });

  it("should distribute yellow checked items to columns using push", () => {
    const newCols = {
      statementList: [
        { id: 1, pinkChecked: false, yellowChecked: true, greenChecked: false },
        { id: 2, pinkChecked: false, yellowChecked: true, greenChecked: false },
      ],
      vCols: { col1: [], col2: [] },
    };
    const finalSortColData = [
      ["col1", 2],
      ["col2", 2],
    ];

    const result = finishThinningSorts(newCols, finalSortColData);

    expect(result.vCols.col1.length).toBeGreaterThan(0);
    expect(result.statementList.length).toBe(0);
  });

  it("should distribute green checked items to columns using unshift", () => {
    const newCols = {
      statementList: [
        { id: 1, pinkChecked: false, yellowChecked: false, greenChecked: true },
        { id: 2, pinkChecked: false, yellowChecked: false, greenChecked: true },
      ],
      vCols: { col1: [], col2: [] },
    };
    const finalSortColData = [
      ["col1", 2],
      ["col2", 2],
    ];

    const result = finishThinningSorts(newCols, finalSortColData);

    expect(result.vCols.col1.length).toBeGreaterThan(0);
    expect(result.statementList.length).toBe(0);
  });

  it("should respect column maximum capacity", () => {
    const newCols = {
      statementList: [
        { id: 1, pinkChecked: true, yellowChecked: false, greenChecked: false },
        { id: 2, pinkChecked: true, yellowChecked: false, greenChecked: false },
        { id: 3, pinkChecked: true, yellowChecked: false, greenChecked: false },
      ],
      vCols: { col1: [] },
    };
    const finalSortColData = [["col1", 2]];

    const result = finishThinningSorts(newCols, finalSortColData);

    expect(result.vCols.col1.length).toBeLessThanOrEqual(2);
  });

  it("should handle mixed color items in correct order (pink, yellow, green)", () => {
    const newCols = {
      statementList: [
        { id: 1, pinkChecked: true, yellowChecked: false, greenChecked: false },
        { id: 2, pinkChecked: false, yellowChecked: true, greenChecked: false },
        { id: 3, pinkChecked: false, yellowChecked: false, greenChecked: true },
      ],
      vCols: { col1: [] },
    };
    const finalSortColData = [["col1", 5]];

    const result = finishThinningSorts(newCols, finalSortColData);

    expect(result.vCols.col1.length).toBe(3);
    expect(result.statementList.length).toBe(0);
  });

  it("should handle empty statementList", () => {
    const newCols = {
      statementList: [],
      vCols: { col1: [], col2: [] },
    };
    const finalSortColData = [
      ["col1", 2],
      ["col2", 2],
    ];

    const result = finishThinningSorts(newCols, finalSortColData);

    expect(result.vCols.col1.length).toBe(0);
    expect(result.vCols.col2.length).toBe(0);
    expect(result.statementList.length).toBe(0);
  });

  it("should handle items with no color flags set", () => {
    const newCols = {
      statementList: [{ id: 1, pinkChecked: false, yellowChecked: false, greenChecked: false }],
      vCols: { col1: [] },
    };
    const finalSortColData = [["col1", 5]];

    const result = finishThinningSorts(newCols, finalSortColData);

    expect(result.vCols.col1.length).toBe(0);
    expect(result.statementList.length).toBe(1);
  });

  it("should distribute items across multiple columns", () => {
    const newCols = {
      statementList: [
        { id: 1, pinkChecked: true, yellowChecked: false, greenChecked: false },
        { id: 2, pinkChecked: true, yellowChecked: false, greenChecked: false },
        { id: 3, pinkChecked: true, yellowChecked: false, greenChecked: false },
        { id: 4, pinkChecked: true, yellowChecked: false, greenChecked: false },
      ],
      vCols: { col1: [], col2: [], col3: [] },
    };
    const finalSortColData = [
      ["col1", 2],
      ["col2", 2],
      ["col3", 2],
    ];

    const result = finishThinningSorts(newCols, finalSortColData);

    const totalPlaced =
      result.vCols.col1.length + result.vCols.col2.length + result.vCols.col3.length;
    expect(totalPlaced).toBe(4);
    expect(result.statementList.length).toBe(0);
  });

  it("should remove items from statementList as they are placed", () => {
    const newCols = {
      statementList: [
        { id: 1, pinkChecked: true, yellowChecked: false, greenChecked: false },
        { id: 2, pinkChecked: false, yellowChecked: true, greenChecked: false },
      ],
      vCols: { col1: [] },
    };
    const finalSortColData = [["col1", 5]];

    const result = finishThinningSorts(newCols, finalSortColData);

    expect(remove).toHaveBeenCalled();
    expect(result.statementList.length).toBe(0);
  });

  it("should handle columns that are already partially filled", () => {
    const newCols = {
      statementList: [{ id: 3, pinkChecked: true, yellowChecked: false, greenChecked: false }],
      vCols: {
        col1: [
          { id: 1, pinkChecked: false, yellowChecked: false, greenChecked: false },
          { id: 2, pinkChecked: false, yellowChecked: false, greenChecked: false },
        ],
      },
    };
    const finalSortColData = [["col1", 3]];

    const result = finishThinningSorts(newCols, finalSortColData);

    expect(result.vCols.col1.length).toBe(3);
    expect(result.statementList.length).toBe(0);
  });

  it("should not exceed counter limits (safety check)", () => {
    const newCols = {
      statementList: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        pinkChecked: true,
        yellowChecked: false,
        greenChecked: false,
      })),
      vCols: { col1: [] },
    };
    const finalSortColData = [["col1", 0]];

    const result = finishThinningSorts(newCols, finalSortColData);

    expect(result).toBeDefined();
    expect(result.vCols.col1.length).toBe(0);
  });
});

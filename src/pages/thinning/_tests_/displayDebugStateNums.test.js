import { describe, it, expect } from "vitest";
import displayDebugStateNums from "../displayDebugStateNums";

describe("displayDebugStateNums", () => {
  it("should return an object with vCols and statementList properties", () => {
    const input = {
      vCols: {},
      statementList: [],
    };

    const result = displayDebugStateNums(input);

    expect(result).toHaveProperty("vCols");
    expect(result).toHaveProperty("statementList");
  });

  it("should extract ids from statementList items", () => {
    const input = {
      vCols: {},
      statementList: [
        { id: 1, name: "Statement 1" },
        { id: 2, name: "Statement 2" },
        { id: 3, name: "Statement 3" },
      ],
    };

    const result = displayDebugStateNums(input);

    expect(result.statementList).toEqual([1, 2, 3]);
  });

  it("should handle empty statementList", () => {
    const input = {
      vCols: {},
      statementList: [],
    };

    const result = displayDebugStateNums(input);

    expect(result.statementList).toEqual([]);
  });

  it("should extract ids from vCols items", () => {
    const input = {
      vCols: {
        col1: [
          { id: 10, data: "item 1" },
          { id: 20, data: "item 2" },
        ],
        col2: [{ id: 30, data: "item 3" }],
      },
      statementList: [],
    };

    const result = displayDebugStateNums(input);

    expect(result.vCols.col1).toEqual([10, 20]);
    expect(result.vCols.col2).toEqual([30]);
  });

  it("should handle empty arrays in vCols", () => {
    const input = {
      vCols: {
        col1: [],
        col2: [{ id: 5, data: "item" }],
        col3: [],
      },
      statementList: [],
    };

    const result = displayDebugStateNums(input);

    expect(result.vCols.col1).toEqual([]);
    expect(result.vCols.col2).toEqual([5]);
    expect(result.vCols.col3).toEqual([]);
  });

  it("should handle complex nested structure", () => {
    const input = {
      vCols: {
        todo: [
          { id: 1, title: "Task 1", priority: "high" },
          { id: 2, title: "Task 2", priority: "low" },
        ],
        inProgress: [{ id: 3, title: "Task 3", priority: "medium" }],
        done: [],
      },
      statementList: [
        { id: 100, statement: "Statement A" },
        { id: 101, statement: "Statement B" },
      ],
    };

    const result = displayDebugStateNums(input);

    expect(result.vCols.todo).toEqual([1, 2]);
    expect(result.vCols.inProgress).toEqual([3]);
    expect(result.vCols.done).toEqual([]);
    expect(result.statementList).toEqual([100, 101]);
  });

  it("should not mutate the original input object", () => {
    const input = {
      vCols: {
        col1: [{ id: 1, data: "original" }],
      },
      statementList: [{ id: 10, name: "original" }],
    };

    const inputCopy = JSON.parse(JSON.stringify(input));
    displayDebugStateNums(input);

    expect(input).toEqual(inputCopy);
  });

  it("should handle multiple vCols keys", () => {
    const input = {
      vCols: {
        a: [{ id: 1 }],
        b: [{ id: 2 }],
        c: [{ id: 3 }],
        d: [{ id: 4 }],
      },
      statementList: [],
    };

    const result = displayDebugStateNums(input);

    expect(Object.keys(result.vCols)).toEqual(["a", "b", "c", "d"]);
    expect(result.vCols.a).toEqual([1]);
    expect(result.vCols.b).toEqual([2]);
    expect(result.vCols.c).toEqual([3]);
    expect(result.vCols.d).toEqual([4]);
  });

  it("should handle items with additional properties beyond id", () => {
    const input = {
      vCols: {
        items: [
          { id: 1, name: "Item 1", value: 100, active: true },
          { id: 2, name: "Item 2", value: 200, active: false },
        ],
      },
      statementList: [{ id: 50, description: "Test", metadata: { key: "value" } }],
    };

    const result = displayDebugStateNums(input);

    expect(result.vCols.items).toEqual([1, 2]);
    expect(result.statementList).toEqual([50]);
  });
});

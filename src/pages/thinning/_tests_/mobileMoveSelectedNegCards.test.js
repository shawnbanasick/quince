import { describe, it, expect, beforeEach } from "vitest";
import mobileMoveSelectedNegCards from "../mobileMoveSelectedNegCards";

describe("mobileMoveSelectedNegCards", () => {
  let mockNewCols2;

  beforeEach(() => {
    mockNewCols2 = {
      statementList: [
        { id: 1, content: "Statement 1" },
        { id: 2, content: "Statement 2" },
        { id: 3, content: "Statement 3" },
        { id: 4, content: "Statement 4" },
      ],
      vCols: {
        0: [],
        1: [],
        2: [],
      },
    };
  });

  it("should move a single selected item to target column", () => {
    const selectedNegItems = [{ id: 1, targetcol: 0 }];

    const result = mobileMoveSelectedNegCards(selectedNegItems, mockNewCols2);

    expect(result.vCols[0]).toHaveLength(1);
    expect(result.vCols[0][0]).toEqual({ id: 1, content: "Statement 1" });
    expect(result.statementList).toHaveLength(3);
    expect(result.statementList.find((item) => item.id === 1)).toBeUndefined();
  });

  it("should move multiple items to different target columns", () => {
    const selectedNegItems = [
      { id: 1, targetcol: 0 },
      { id: 3, targetcol: 1 },
      { id: 4, targetcol: 2 },
    ];

    const result = mobileMoveSelectedNegCards(selectedNegItems, mockNewCols2);

    expect(result.vCols[0]).toHaveLength(1);
    expect(result.vCols[0][0].id).toBe(1);
    expect(result.vCols[1]).toHaveLength(1);
    expect(result.vCols[1][0].id).toBe(3);
    expect(result.vCols[2]).toHaveLength(1);
    expect(result.vCols[2][0].id).toBe(4);
    expect(result.statementList).toHaveLength(1);
    expect(result.statementList[0].id).toBe(2);
  });

  it("should move multiple items to the same target column", () => {
    const selectedNegItems = [
      { id: 1, targetcol: 1 },
      { id: 2, targetcol: 1 },
    ];

    const result = mobileMoveSelectedNegCards(selectedNegItems, mockNewCols2);

    expect(result.vCols[1]).toHaveLength(2);
    expect(result.vCols[1][0].id).toBe(1);
    expect(result.vCols[1][1].id).toBe(2);
    expect(result.statementList).toHaveLength(2);
  });

  it("should handle empty selectedNegItems array", () => {
    const selectedNegItems = [];

    const result = mobileMoveSelectedNegCards(selectedNegItems, mockNewCols2);

    expect(result.vCols[0]).toHaveLength(0);
    expect(result.vCols[1]).toHaveLength(0);
    expect(result.vCols[2]).toHaveLength(0);
    expect(result.statementList).toHaveLength(4);
  });

  it("should handle non-existent item ids gracefully", () => {
    const selectedNegItems = [{ id: 999, targetcol: 0 }];

    const result = mobileMoveSelectedNegCards(selectedNegItems, mockNewCols2);

    expect(result.vCols[0]).toHaveLength(0);
    expect(result.statementList).toHaveLength(4);
  });

  it("should preserve existing items in target columns", () => {
    mockNewCols2.vCols[1] = [{ id: 100, content: "Existing item" }];

    const selectedNegItems = [{ id: 2, targetcol: 1 }];

    const result = mobileMoveSelectedNegCards(selectedNegItems, mockNewCols2);

    expect(result.vCols[1]).toHaveLength(2);
    expect(result.vCols[1][0].id).toBe(100);
    expect(result.vCols[1][1].id).toBe(2);
  });

  it("should return the modified newCols2 object", () => {
    const selectedNegItems = [{ id: 1, targetcol: 0 }];

    const result = mobileMoveSelectedNegCards(selectedNegItems, mockNewCols2);

    expect(result).toBe(mockNewCols2);
  });

  it("should handle items with complex properties", () => {
    mockNewCols2.statementList = [
      { id: 1, content: "Test", metadata: { score: 5 }, tags: ["important"] },
    ];

    const selectedNegItems = [{ id: 1, targetcol: 0 }];

    const result = mobileMoveSelectedNegCards(selectedNegItems, mockNewCols2);

    expect(result.vCols[0][0]).toEqual({
      id: 1,
      content: "Test",
      metadata: { score: 5 },
      tags: ["important"],
    });
  });

  it("should handle moving all items from statementList", () => {
    const selectedNegItems = [
      { id: 1, targetcol: 0 },
      { id: 2, targetcol: 0 },
      { id: 3, targetcol: 1 },
      { id: 4, targetcol: 2 },
    ];

    const result = mobileMoveSelectedNegCards(selectedNegItems, mockNewCols2);

    expect(result.statementList).toHaveLength(0);
    expect(result.vCols[0]).toHaveLength(2);
    expect(result.vCols[1]).toHaveLength(1);
    expect(result.vCols[2]).toHaveLength(1);
  });
});

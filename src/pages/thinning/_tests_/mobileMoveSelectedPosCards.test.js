import { describe, it, expect, beforeEach, vi } from "vitest";
import moveSelectedPosCards from "../moveSelectedPosCards";

describe("moveSelectedPosCards", () => {
  let mockNewCols;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Setup mock data
    mockNewCols = {
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

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(() => JSON.stringify(mockNewCols)),
      setItem: vi.fn(),
      clear: vi.fn(),
    };
    window.localStorage = localStorageMock;
  });

  it("should move a single selected item to target column", () => {
    const selectedPosItems = [{ id: 1, targetcol: 0 }];

    moveSelectedPosCards(selectedPosItems);

    expect(localStorage.getItem).toHaveBeenCalledWith("newCols");
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(savedData.vCols[0]).toHaveLength(1);
    expect(savedData.vCols[0][0]).toEqual({ id: 1, content: "Statement 1" });
    expect(savedData.statementList).toHaveLength(3);
    expect(savedData.statementList.find((item) => item.id === 1)).toBeUndefined();
  });

  it("should move multiple items to different target columns", () => {
    const selectedPosItems = [
      { id: 1, targetcol: 0 },
      { id: 3, targetcol: 1 },
      { id: 4, targetcol: 2 },
    ];

    moveSelectedPosCards(selectedPosItems);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);

    expect(savedData.vCols[0]).toHaveLength(1);
    expect(savedData.vCols[0][0].id).toBe(1);
    expect(savedData.vCols[1]).toHaveLength(1);
    expect(savedData.vCols[1][0].id).toBe(3);
    expect(savedData.vCols[2]).toHaveLength(1);
    expect(savedData.vCols[2][0].id).toBe(4);
    expect(savedData.statementList).toHaveLength(1);
    expect(savedData.statementList[0].id).toBe(2);
  });

  it("should move multiple items to the same target column", () => {
    const selectedPosItems = [
      { id: 1, targetcol: 1 },
      { id: 2, targetcol: 1 },
    ];

    moveSelectedPosCards(selectedPosItems);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);

    expect(savedData.vCols[1]).toHaveLength(2);
    expect(savedData.vCols[1][0].id).toBe(1);
    expect(savedData.vCols[1][1].id).toBe(2);
    expect(savedData.statementList).toHaveLength(2);
    expect(savedData.statementList[0].id).toBe(3);
    expect(savedData.statementList[1].id).toBe(4);
  });

  it("should handle empty selectedPosItems array", () => {
    const selectedPosItems = [];

    moveSelectedPosCards(selectedPosItems);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);

    expect(savedData.vCols[0]).toHaveLength(0);
    expect(savedData.vCols[1]).toHaveLength(0);
    expect(savedData.vCols[2]).toHaveLength(0);
    expect(savedData.statementList).toHaveLength(4);
  });

  it("should handle non-existent item ids gracefully", () => {
    const selectedPosItems = [{ id: 999, targetcol: 0 }];

    moveSelectedPosCards(selectedPosItems);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);

    expect(savedData.vCols[0]).toHaveLength(0);
    expect(savedData.statementList).toHaveLength(4);
  });

  it("should preserve existing items in target columns", () => {
    mockNewCols.vCols[1] = [{ id: 100, content: "Existing item" }];
    localStorage.getItem = vi.fn(() => JSON.stringify(mockNewCols));

    const selectedPosItems = [{ id: 2, targetcol: 1 }];

    moveSelectedPosCards(selectedPosItems);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);

    expect(savedData.vCols[1]).toHaveLength(2);
    expect(savedData.vCols[1][0].id).toBe(100);
    expect(savedData.vCols[1][1].id).toBe(2);
  });

  it("should save data to localStorage with correct key", () => {
    const selectedPosItems = [{ id: 1, targetcol: 0 }];

    moveSelectedPosCards(selectedPosItems);

    expect(localStorage.setItem).toHaveBeenCalledWith("newCols", expect.any(String));
  });

  it("should handle items with complex properties", () => {
    mockNewCols.statementList = [
      { id: 1, content: "Test", metadata: { score: 5 }, tags: ["important"] },
    ];
    localStorage.getItem = vi.fn(() => JSON.stringify(mockNewCols));

    const selectedPosItems = [{ id: 1, targetcol: 0 }];

    moveSelectedPosCards(selectedPosItems);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);

    expect(savedData.vCols[0][0]).toEqual({
      id: 1,
      content: "Test",
      metadata: { score: 5 },
      tags: ["important"],
    });
  });

  it("should handle moving all items from statementList", () => {
    const selectedPosItems = [
      { id: 1, targetcol: 0 },
      { id: 2, targetcol: 0 },
      { id: 3, targetcol: 1 },
      { id: 4, targetcol: 2 },
    ];

    moveSelectedPosCards(selectedPosItems);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);

    expect(savedData.statementList).toHaveLength(0);
    expect(savedData.vCols[0]).toHaveLength(2);
    expect(savedData.vCols[1]).toHaveLength(1);
    expect(savedData.vCols[2]).toHaveLength(1);
  });

  it("should return undefined", () => {
    const selectedPosItems = [{ id: 1, targetcol: 0 }];

    const result = moveSelectedPosCards(selectedPosItems);

    expect(result).toBeUndefined();
  });

  it("should handle null localStorage data gracefully", () => {
    localStorage.getItem = vi.fn(() => null);

    const selectedPosItems = [{ id: 1, targetcol: 0 }];

    expect(() => moveSelectedPosCards(selectedPosItems)).toThrow();
  });

  it("should handle invalid JSON in localStorage", () => {
    localStorage.getItem = vi.fn(() => "invalid json");

    const selectedPosItems = [{ id: 1, targetcol: 0 }];

    expect(() => moveSelectedPosCards(selectedPosItems)).toThrow();
  });

  it("should read from localStorage on each call", () => {
    const selectedPosItems = [{ id: 1, targetcol: 0 }];

    moveSelectedPosCards(selectedPosItems);

    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledWith("newCols");
  });

  it("should maintain order of items when moving multiple to same column", () => {
    const selectedPosItems = [
      { id: 1, targetcol: 0 },
      { id: 3, targetcol: 0 },
      { id: 4, targetcol: 0 },
    ];

    moveSelectedPosCards(selectedPosItems);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);

    expect(savedData.vCols[0]).toHaveLength(3);
    expect(savedData.vCols[0][0].id).toBe(1);
    expect(savedData.vCols[0][1].id).toBe(3);
    expect(savedData.vCols[0][2].id).toBe(4);
  });
});

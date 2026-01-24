import { describe, it, expect, beforeEach, vi } from "vitest";
import moveSelectedPosCards from "../moveSelectedPosCards";

describe("moveSelectedPosCards", () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean slate
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should move items from statementList to the specified target column in vCols", () => {
    // 1. Setup initial state in localStorage
    const initialData = {
      statementList: [
        { id: "card-1", text: "First Card" },
        { id: "card-2", text: "Second Card" },
      ],
      vCols: {
        done: [],
        review: [],
      },
    };
    localStorage.setItem("newCols", JSON.stringify(initialData));

    // 2. Define the items to move
    const selectedPosItems = [{ id: "card-1", targetcol: "done" }];

    // 3. Execute the function
    moveSelectedPosCards(selectedPosItems);

    // 4. Assertions
    const updatedData = JSON.parse(localStorage.getItem("newCols"));

    // Check if card-1 moved to 'done'
    expect(updatedData.vCols.done).toContainEqual({ id: "card-1", text: "First Card" });

    // Check if card-1 was removed from statementList
    expect(updatedData.statementList).toHaveLength(1);
    expect(updatedData.statementList[0].id).toBe("card-2");
  });

  it("should handle multiple items moving to different columns", () => {
    const initialData = {
      statementList: [
        { id: "1", val: "A" },
        { id: "2", val: "B" },
      ],
      vCols: { colA: [], colB: [] },
    };
    localStorage.setItem("newCols", JSON.stringify(initialData));

    const selectedPosItems = [
      { id: "1", targetcol: "colA" },
      { id: "2", targetcol: "colB" },
    ];

    moveSelectedPosCards(selectedPosItems);

    const result = JSON.parse(localStorage.getItem("newCols"));
    expect(result.vCols.colA[0].id).toBe("1");
    expect(result.vCols.colB[0].id).toBe("2");
    expect(result.statementList).toHaveLength(0);
  });

  it("should do nothing if the item ID is not found in statementList", () => {
    const initialData = {
      statementList: [{ id: "1", val: "A" }],
      vCols: { target: [] },
    };
    localStorage.setItem("newCols", JSON.stringify(initialData));

    // Moving an ID that doesn't exist
    moveSelectedPosCards([{ id: "99", targetcol: "target" }]);

    const result = JSON.parse(localStorage.getItem("newCols"));
    expect(result.vCols.target).toHaveLength(0);
    expect(result.statementList).toHaveLength(1);
  });
});

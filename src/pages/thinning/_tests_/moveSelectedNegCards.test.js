import { describe, it, expect, beforeEach, vi } from "vitest";
import moveSelectedNegCards from "../moveSelectedNegCards";

describe("moveSelectedNegCards", () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean slate
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should move items from statementList to the specified target vCols", () => {
    // 1. Setup initial localStorage state
    const initialData = {
      statementList: [
        { id: "1", text: "Card 1" },
        { id: "2", text: "Card 2" },
      ],
      vCols: {
        negative: [],
        positive: [],
      },
    };
    localStorage.setItem("newCols", JSON.stringify(initialData));

    // 2. Define the items to move
    const selectedNegItems = [{ id: "1", targetcol: "negative" }];

    // 3. Execute the function
    moveSelectedNegCards(selectedNegItems);

    // 4. Parse the result from localStorage
    const updatedData = JSON.parse(localStorage.getItem("newCols"));

    // Assertions
    expect(updatedData.statementList).toHaveLength(1);
    expect(updatedData.statementList[0].id).toBe("2");
    expect(updatedData.vCols.negative).toContainEqual({ id: "1", text: "Card 1" });
  });

  it("should handle moving multiple items to different columns", () => {
    const initialData = {
      statementList: [
        { id: "1", text: "A" },
        { id: "2", text: "B" },
      ],
      vCols: {
        colA: [],
        colB: [],
      },
    };
    localStorage.setItem("newCols", JSON.stringify(initialData));

    const selectedItems = [
      { id: "1", targetcol: "colA" },
      { id: "2", targetcol: "colB" },
    ];

    moveSelectedNegCards(selectedItems);

    const result = JSON.parse(localStorage.getItem("newCols"));
    expect(result.statementList).toHaveLength(0);
    expect(result.vCols.colA[0].id).toBe("1");
    expect(result.vCols.colB[0].id).toBe("2");
  });

  it("should do nothing if the item ID is not found in statementList", () => {
    const initialData = {
      statementList: [{ id: "1", text: "Keep Me" }],
      vCols: { negative: [] },
    };
    localStorage.setItem("newCols", JSON.stringify(initialData));

    // Item ID '99' does not exist
    moveSelectedNegCards([{ id: "99", targetcol: "negative" }]);

    const result = JSON.parse(localStorage.getItem("newCols"));
    expect(result.statementList).toHaveLength(1);
    expect(result.vCols.negative).toHaveLength(0);
  });
});

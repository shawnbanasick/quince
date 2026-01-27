import { describe, it, expect } from "vitest";
import getDragOverHighlightColor from "../getDragOverHighlightColor";

describe("getDragOverHighlightColor", () => {
  const mockHeaderColors = ["red", "blue", "green"];
  const mockQSortHeaders = ["id", "name", "date"];
  const columnWidth = 100;

  it("should return lightblue when the index matches the dragged column location", () => {
    // "column2" -> slice(6) -> "2" -> qSortHeaders[2] is 'date'
    // If index is 2, it should match.
    const result = getDragOverHighlightColor(
      2,
      columnWidth,
      mockHeaderColors,
      mockQSortHeaders,
      "column2",
    );

    expect(result.minWidth).toBe(117);
  });

  it("should return the original header color when the index does NOT match", () => {
    const result = getDragOverHighlightColor(
      0,
      columnWidth,
      mockHeaderColors,
      mockQSortHeaders,
      "column2", // location will be 2, but index is 0
    );

    expect(result.background).toBe("red");
  });

  it("should handle non-numeric column IDs correctly via qSortHeaders.indexOf", () => {
    // "columnstatus" -> slice(6) -> "status"
    const customHeaders = ["id", "status", "type"];
    const result = getDragOverHighlightColor(
      1,
      columnWidth,
      mockHeaderColors,
      customHeaders,
      "columnstatus",
    );

    expect(result.background).toBe("lightblue");
  });

  it("should return the correct static style properties", () => {
    const result = getDragOverHighlightColor(0, 100, mockHeaderColors, mockQSortHeaders, "column0");

    expect(result).toMatchObject({
      height: 50,
      border: "solid 1.5px black",
      fontSize: 25,
      textAlign: "center",
      paddingTop: 5,
    });
  });
});

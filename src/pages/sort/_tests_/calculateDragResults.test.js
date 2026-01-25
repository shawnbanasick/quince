import { describe, it, expect, vi } from "vitest";
import calculateDragResults from "../calculateDragResults";

describe("calculateDragResults", () => {
  const totalStatements = 3;
  const results = { sort: "" };
  const sortFinishedModalHasBeenShown = false;

  it("should correctly parse positive column IDs and update sortGridResults", () => {
    const outcome = {
      destination: { droppableId: "column5" },
      draggableId: "s1",
    };
    const sortGridResults = {};

    const result = calculateDragResults(
      outcome,
      totalStatements,
      results,
      sortFinishedModalHasBeenShown,
      sortGridResults,
    );

    expect(result.sortGridResults["s1"]).toBe(5);
    expect(result.isSortingFinished).toBe(true); // Based on active code line 7
  });

  it("should correctly parse negative column IDs (N) into negative numbers", () => {
    const outcome = {
      destination: { droppableId: "columnN4" },
      draggableId: "s2",
    };
    const sortGridResults = {};

    const result = calculateDragResults(
      outcome,
      totalStatements,
      results,
      sortFinishedModalHasBeenShown,
      sortGridResults,
    );

    expect(result.sortGridResults["s2"]).toBe(-4);
  });

  it("should return undefined if destination is null", () => {
    const outcome = { destination: null, draggableId: "s1" };
    const sortGridResults = {};

    const result = calculateDragResults(
      outcome,
      totalStatements,
      results,
      sortFinishedModalHasBeenShown,
      sortGridResults,
    );

    expect(result).toBeUndefined();
  });

  it("should log an error and not crash if an exception occurs", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Passing null to trigger an error when accessing outcome.destination
    calculateDragResults(null, totalStatements, {}, false, {});

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

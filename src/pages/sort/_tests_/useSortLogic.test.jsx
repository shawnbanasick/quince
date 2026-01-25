import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useSortLogic } from "../mobileSortHooks/useSortLogic"; // adjust path
import useStore from "../../../globalState/useStore";
import useLocalStorage from "../../../utilities/useLocalStorage";

// 1. Mocks
vi.mock("../../../globalState/useStore");
vi.mock("../../../utilities/useLocalStorage");
vi.mock("uuid", () => ({ v4: () => "mocked-uuid" }));
vi.mock("../mobileSortComponents/ColumnHeader", () => ({
  default: () => "ColumnHeader",
}));

describe("useSortLogic Hook", () => {
  const mockSetTrigger = vi.fn();

  const mockMapObj = {
    qSortPattern: [1, 2],
    qSortHeaderNumbers: [10, 20],
    columnHeadersColorsArray: ["red", "blue"],
    colTextLabelsArray: ["Label 1", "Label 2"],
    useColLabelNums: [true],
    useColLabelText: [true],
    useColLabelEmoji: [true],
  };

  const mockDisplayArray = ["😊", "🚀"];
  const mockConfigObj = { allowUnforcedSorts: false };

  // Initial data for localStorage mocks
  const initialSortArray = [
    { id: "1", selected: false, text: "A" },
    { id: "2", selected: false, text: "B" },
    { id: "3", selected: false, text: "C" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useStore to return the trigger function
    useStore.mockReturnValue(mockSetTrigger);

    // Mock useLocalStorage implementation
    let storage1 = [...initialSortArray];
    useLocalStorage.mockImplementation((key, initialValue) => {
      if (key === "m_SortArray1")
        return [
          storage1,
          (val) => {
            storage1 = val;
          },
        ];
      return [initialValue, vi.fn()];
    });

    // Mock global localStorage for the initial parse in your code
    window.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(initialSortArray));
    window.localStorage.setItem = vi.fn();
  });

  it("should initialize partitionArray based on sortingPattern", () => {
    const { result } = renderHook(() => useSortLogic(mockMapObj, mockDisplayArray, mockConfigObj));

    // Pattern is [1, 2] reversed -> [2, 1]
    // result.current.partitionArray should have length 2
    expect(result.current.partitionArray).toHaveLength(2);
  });

  it("should handle card selection and trigger modal when two are selected", () => {
    const { result } = renderHook(() => useSortLogic(mockMapObj, mockDisplayArray, mockConfigObj));

    const mockEvent1 = {
      target: {
        dataset: { id: "1", statement_text: "A", color: "red", index: "0" },
      },
    };

    const mockEvent2 = {
      target: {
        dataset: { id: "2", statement_text: "B", color: "blue", index: "1" },
      },
    };

    act(() => {
      result.current.handleCardSelected(mockEvent1);
    });

    expect(result.current.targetArray.current).toHaveLength(1);
    expect(mockSetTrigger).not.toHaveBeenCalled();

    act(() => {
      result.current.handleCardSelected(mockEvent2);
    });

    expect(result.current.targetArray.current).toHaveLength(2);
    expect(mockSetTrigger).toHaveBeenCalledWith(true);
  });

  it("should swap statements correctly", () => {
    const { result } = renderHook(() => useSortLogic(mockMapObj, mockDisplayArray, mockConfigObj));

    const initialFirstId = result.current.sortArray1[0].id;
    const initialSecondId = result.current.sortArray1[1].id;

    act(() => {
      result.current.handleStatementSwap(0, 1);
    });

    expect(result.current.sortArray1[0].id).toBe(initialSecondId);
    expect(result.current.sortArray1[1].id).toBe(initialFirstId);
  });

  it("should handle handleOnClickUp for forced sorting (swap with previous)", () => {
    const { result } = renderHook(() => useSortLogic(mockMapObj, mockDisplayArray, mockConfigObj));

    const mockEvent = { target: { id: "2" } }; // Clicking "Up" on the second item

    act(() => {
      result.current.handleOnClickUp(mockEvent);
    });

    // In forced sort, it should swap index 1 with index 0
    expect(result.current.sortArray1[0].id).toBe("2");
    expect(result.current.sortArray1[1].id).toBe("1");
  });

  it("should clear selections", () => {
    const { result } = renderHook(() => useSortLogic(mockMapObj, mockDisplayArray, mockConfigObj));

    act(() => {
      result.current.clearSelected();
    });

    const allSelectedFalse = result.current.sortArray1.every((i) => !i.selected);
    expect(allSelectedFalse).toBe(true);
    expect(result.current.targetArray.current).toEqual([]);
  });
});

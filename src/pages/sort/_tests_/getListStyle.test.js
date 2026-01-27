import { describe, it, expect, vi, beforeEach } from "vitest";
import getListStyle from "../getListStyle";
import useStore from "../../../globalState/useStore";

// Mock the zustand store
vi.mock("../../../globalState/useStore", () => ({
  default: {
    setState: vi.fn(),
  },
}));

describe("getListStyle", () => {
  const defaultProps = {
    columnStatementsArray: [1, 2, 3],
    maxCards: 5,
    columnId: "col-1",
    minHeight: 500,
  };

  const columnWidth = "300px";
  const columnColor = "white";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return lightblue background and update store when dragging over", () => {
    const style = getListStyle(true, defaultProps, false, columnWidth, columnColor);

    expect(style.background).toBe("lightblue");
    expect(useStore.setState).toHaveBeenCalledWith({ draggingOverColumnId: "col-1" });
  });

  it("should return the default column color when not dragging and under max cards", () => {
    const style = getListStyle(false, defaultProps, true, columnWidth, columnColor);

    expect(style.background).toBe(columnColor);
    expect(style.borderRight).toBe("1px solid lightgray");
  });

  it("should return warning styles (#F4BB44 and dashed borders) when overloaded and forcedSorts is true", () => {
    const overloadedProps = {
      ...defaultProps,
      columnStatementsArray: [1, 2, 3, 4, 5, 6],
      maxCards: 5,
    };
    const style = getListStyle(false, overloadedProps, true, columnWidth, columnColor);

    expect(style.background).toBe("#F4BB44");
    expect(style.borderRight).toBe("3px dashed black");
    expect(style.borderBottom).toBe("3px dashed black");
  });

  it("should ignore max card limits if forcedSorts is false", () => {
    const overloadedProps = {
      ...defaultProps,
      columnStatementsArray: [1, 2, 3, 4, 5, 6],
      maxCards: 5,
    };
    // Even though it's overloaded, forcedSorts = false should keep it "valid"
    const style = getListStyle(false, overloadedProps, false, columnWidth, columnColor);

    expect(style.background).toBe(columnColor);
    expect(style.borderRight).toBe("1px solid lightgray");
  });

  it("should calculate minHeight correctly (props.minHeight - 12)", () => {
    const style = getListStyle(false, defaultProps, false, columnWidth, columnColor);
    expect(style.minHeight).toBe(488);
  });
});

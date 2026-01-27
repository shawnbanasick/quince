import { describe, it, expect, vi, beforeEach } from "vitest";
import processMapXMLData from "../processMapXMLData";
import useStore from "../../globalState/useStore";

// Mock the Zustand store
vi.mock("../../globalState/useStore", () => ({
  default: {
    setState: vi.fn(),
  },
}));

describe("processMapXMLData", () => {
  // Sample mock data representing the XML-to-JSON structure
  const mockDataObject = {
    map: {
      info: [{ _attributes: { id: "mapFileVersion" }, _text: "1.2.3" }],
      column: [
        { _attributes: { id: "-1", colour: "FF0000" }, _text: "5" },
        { _attributes: { id: "1", colour: "00FF00" }, _text: "10" },
      ],
      item: [
        { _attributes: { id: "qSortPattern" }, _text: "1,2,3" },
        { _attributes: { id: "qSortHeaders" }, _text: "colA,colB" },
        { _attributes: { id: "qSortHeaderNumbers" }, _text: "101,102" },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should correctly extract the map version", () => {
    const result = processMapXMLData(mockDataObject);
    expect(result.mapObj.mapFileVersion).toBe("1.2.3");
  });

  it("should process columns and handle negative IDs (columnN)", () => {
    const result = processMapXMLData(mockDataObject);

    // Check vColsObj keys
    expect(result.vColsObj).toHaveProperty("columnN1");
    expect(result.vColsObj).toHaveProperty("column1");

    // Check Zustand store update
    expect(useStore.setState).toHaveBeenCalledWith({
      vColsObj: result.vColsObj,
    });
  });

  it("should create the postsortConvertObj correctly", () => {
    const result = processMapXMLData(mockDataObject);

    // Based on qSortHeaders ['colA', 'colB'] and qSortHeaderNumbers ['101', '102']
    expect(result.mapObj.postsortConvertObj).toEqual({
      columncolA: "101",
      columncolB: "102",
    });
  });
});

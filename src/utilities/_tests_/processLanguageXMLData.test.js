import { describe, it, expect, vi, beforeEach } from "vitest";
import processLanguageXMLData from "../processLanguageXMLData";
import useStore from "../../globalState/useStore";

vi.mock("../../globalState/useStore");

describe("processLanguageXMLData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockXMLData = {
    language: {
      info: [{ _attributes: { id: "languageFileVersion" }, _text: "1.0.4" }],
      item: [
        { _attributes: { id: "GREETING" }, _text: "Hello" },
        { _attributes: { id: "FAREWELL" }, _text: "Goodbye" },
      ],
    },
  };

  it("should correctly parse XML data and return a language object", () => {
    const result = processLanguageXMLData(mockXMLData);

    expect(result).toEqual({
      langFileVersion: "1.0.4",
      GREETING: "Hello",
      FAREWELL: "Goodbye",
    });
  });

  it("should call useStore.setState for each item in the data array", () => {
    processLanguageXMLData(mockXMLData);

    // Check if setState was called for the items
    expect(useStore.setState).toHaveBeenCalledWith({ GREETING: "Hello" });
    expect(useStore.setState).toHaveBeenCalledWith({ FAREWELL: "Goodbye" });

    // Total calls should match the number of items in the 'item' array
    expect(useStore.setState).toHaveBeenCalledTimes(2);
  });

  it("should handle errors gracefully and return undefined", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Passing malformed data to trigger the catch block
    const result = processLanguageXMLData({});

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith("there was a language import error");

    consoleSpy.mockRestore();
  });
});

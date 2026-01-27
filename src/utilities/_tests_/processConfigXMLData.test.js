import { describe, it, expect, beforeEach, vi } from "vitest";
import processConfigXMLData from "../processConfigXMLData";

describe("processConfigXMLData", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
    // Spy on console.log to prevent cluttering test output
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  const mockBaseData = (elements = []) => ({
    elements: [
      {
        elements: [
          { attributes: { id: "configFileVersion" }, elements: [{ text: "1.0" }] },
          ...elements,
        ],
      },
    ],
  });

  // Section 1: Basic Configuration Parsing

  it("should extract the file version correctly", () => {
    const input = mockBaseData([]);
    const result = processConfigXMLData(input);
    expect(result.configObj.mapFileVersion).toBe("1.0");
  });

  it('should convert "true"/"false" strings to booleans and numeric strings to numbers', () => {
    const input = mockBaseData([
      { attributes: { id: "showTimer" }, elements: [{ text: "true" }] },
      { attributes: { id: "maxAttempts" }, elements: [{ text: "5" }] },
      { attributes: { id: "debugMode" }, elements: [{ text: "false" }] },
    ]);

    const { configObj } = processConfigXMLData(input);
    expect(configObj.showTimer).toBe(true);
    expect(configObj.maxAttempts).toBe(5);
    expect(configObj.debugMode).toBe(false);
  });

  it("should skip specific array keys as per the console.log skip logic", () => {
    const input = mockBaseData([
      { attributes: { id: "qSortHeaders" }, elements: [{ text: "some content" }] },
    ]);
    const { configObj } = processConfigXMLData(input);
    expect(configObj.qSortHeaders).toBeUndefined();
  });

  //   ---

  //   // Section 2: Survey Logic & Type Parsing

  it('should process "information" type survey questions', () => {
    const input = mockBaseData([
      {
        attributes: { id: "survey" },
        elements: [
          { attributes: { type: "information" } },
          { attributes: { bg: "blue" }, elements: [{ text: "Welcome Info" }] },
        ],
      },
    ]);

    const result = processConfigXMLData(input);
    const question = result.surveyQuestionObjArray[0];

    expect(question.type).toBe("information");
    expect(question.background).toBe("blue");
    expect(question.options).toBe("Welcome Info");
    expect(result.requiredAnswersObj["itemNum1"]).toBe("info - n.a.");
  });

  it('should process "text" questions and handle "required" logic', () => {
    const input = mockBaseData([
      {
        attributes: { id: "survey" },
        elements: [
          { attributes: { type: "text", required: "true", limitLength: "100" } },
          { elements: [{ text: "What is your name?" }] }, // label
          { elements: [{ text: "Enter full name" }] }, // note
          { elements: [{ text: "John Doe" }] }, // placeholder
        ],
      },
    ]);

    const result = processConfigXMLData(input);
    const question = result.surveyQuestionObjArray[0];

    expect(question.type).toBe("text");
    expect(question.required).toBe(true);
    expect(question.limitLength).toBe(100);
    expect(result.requiredAnswersObj["itemNum1"]).toBe("no-*?*-response");
  });

  it('should process "radio" questions and handle "other" attribute', () => {
    const input = mockBaseData([
      {
        attributes: { id: "survey" },
        elements: [
          {
            attributes: { type: "radio", required: "false", other: "true" },
            elements: [{ text: "Opt1;Opt2" }],
          },
          { elements: [{ text: "Pick one" }] },
        ],
      },
    ]);

    const result = processConfigXMLData(input);
    const question = result.surveyQuestionObjArray[0];

    expect(question.type).toBe("radio");
    expect(question.other).toBe(true);
    expect(question.options).toBe("Opt1;Opt2");
    expect(result.requiredAnswersObj["itemNum1"]).toBe("no response");
  });

  // Section 3: LocalStorage & Fallbacks

  it("should initialize localStorage if resultsSurvey does not exist", () => {
    const input = mockBaseData([
      {
        attributes: { id: "survey" },
        elements: [{ attributes: { type: "information" } }, { attributes: { bg: "red" } }],
      },
    ]);

    processConfigXMLData(input);

    expect(localStorage.getItem("resultsSurvey")).toBeDefined();
    const stored = JSON.parse(localStorage.getItem("resultsSurvey"));
    expect(stored.itemNum1).toBe("info - n.a.");
  });
});

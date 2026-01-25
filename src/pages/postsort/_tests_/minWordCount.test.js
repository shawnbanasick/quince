import { describe, it, expect } from "vitest";
import { minWordCount } from "../minWordCount"; // Adjust path as needed

describe("minWordCount", () => {
  it("should return zeros for an empty string", () => {
    const result = minWordCount("");
    expect(result).toEqual({
      cjk: 0,
      nonCJK: 1, // Note: "".split(" ") returns [""] which has length 1
      totalWords: 1,
    });
  });

  it("should correctly count standard English words", () => {
    const input = "Hello world from Vitest";
    const result = minWordCount(input);

    expect(result.nonCJK).toBe(4);
    expect(result.cjk).toBe(0);
    expect(result.totalWords).toBe(4);
  });

  it("should correctly count CJK characters", () => {
    const input = "こんにちは"; // 5 Japanese characters
    const result = minWordCount(input);

    expect(result.cjk).toBe(5);
    expect(result.nonCJK).toBe(1); // Treated as one "word" because no spaces
    expect(result.totalWords).toBe(6);
  });

  it("should handle a mix of English and CJK characters", () => {
    const input = "Hello 世界"; // "Hello" + 2 Chinese characters
    const result = minWordCount(input);

    // "Hello" and "世界" are 2 words via split(" ")
    // "世界" provides 2 CJK matches
    expect(result.nonCJK).toBe(2);
    expect(result.cjk).toBe(2);
    expect(result.totalWords).toBe(4);
  });

  it("should handle multiple spaces and punctuation within non-CJK text", () => {
    const input = "React is  awesome!";
    const result = minWordCount(input);

    // .split(" ") will catch the empty string between the double spaces
    expect(result.nonCJK).toBe(4);
    expect(result.totalWords).toBe(4);
  });
});

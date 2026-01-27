import { describe, it, expect, vi, afterEach } from "vitest";
import getRandomId from "../getRandomId";

describe("getRandomId", () => {
  // Clean up mocks after each test to avoid side effects
  afterEach(() => {
    vi.spyOn(Math, "random").mockRestore();
  });

  it("should return a string of exactly 8 characters", () => {
    const id = getRandomId();
    expect(id).toHaveLength(8);
    expect(typeof id).toBe("string");
  });

  it("should only contain uppercase letters (A-Z)", () => {
    const id = getRandomId();
    // Regex checks that every character is an uppercase letter
    expect(id).toMatch(/^[A-Z]{8}$/);
  });

  it("should produce predictable output when Math.random is mocked", () => {
    // We mock Math.random to always return 0.
    // 65 + (0 * 26) = 65 -> String.fromCharCode(65) is 'A'
    const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0);

    const id = getRandomId();

    expect(id).toBe("AAAAAAAA");
    expect(mockRandom).toHaveBeenCalledTimes(8);
  });

  it('should produce "Z" when Math.random is at its upper bound', () => {
    // 65 + (0.999 * 26) = 65 + 25.974 = 90.974 -> Math.floor is 90
    // String.fromCharCode(90) is 'Z'
    vi.spyOn(Math, "random").mockReturnValue(0.999);

    const id = getRandomId();

    expect(id).toBe("ZZZZZZZZ");
  });

  it("should generate different IDs on subsequent calls (non-mocked)", () => {
    const id1 = getRandomId();
    const id2 = getRandomId();
    expect(id1).not.toBe(id2);
  });
});

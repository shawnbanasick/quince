import { describe, it, expect, vi } from "vitest";
import decodeHTML from "../decodeHTML";

describe("decodeHTML utility", () => {
  it("should return an empty string if input is null or undefined", () => {
    expect(decodeHTML(null)).toBe("");
    expect(decodeHTML(undefined)).toBe("");
  });

  it('should return the original string if it does not contain "{{{"', () => {
    const input = "Hello world";
    expect(decodeHTML(input)).toBe(input);
  });

  it('should wrap the result in a div and replace syntax when "{{{" is present', () => {
    const input = "{{{b}}}Bold Text{{{/b}}}";
    const expected = "<div><b>Bold Text</b></div>";
    expect(decodeHTML(input)).toBe(expected);
  });

  it("should correctly decode HTML entities like &amp;, &quot;, and &apos;", () => {
    const input = "{{{span}}}&amp; &quot; &apos;{{{/span}}}";
    // &amp; -> &
    // &quot; -> "
    // &apos; -> '
    const expected = "<div><span>& \" '</span></div>";
    expect(decodeHTML(input)).toBe(expected);
  });

  it("should handle case-insensitive replacements for the curly braces", () => {
    // Though unusual, your regex uses /gi, so let's verify it works
    const input = "{{{test}}}";
    expect(decodeHTML(input)).toBe("<div><test></div>");
  });

  it("should log an error to the console if an exception occurs", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Passing a type that might cause .includes to fail (like a number)
    // to trigger the catch block
    decodeHTML(123);

    expect(logSpy).toHaveBeenCalledWith("There was an error decoding into HTML");
    expect(consoleSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});

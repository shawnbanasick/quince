import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useTextLocalization } from "../mobileSortHooks/useTextLocalization";

// Mock the dependencies
vi.mock("html-react-parser", () => ({
  default: vi.fn((val) => `parsed-${val}`),
}));

vi.mock("../../../utilities/decodeHTML", () => ({
  default: vi.fn((val) => `decoded-${val}`),
}));

describe("useTextLocalization", () => {
  const mockLangObj = {
    mobileSortConditionsOfInstruction: "text1",
    screenOrientationText: "text2",
    expandViewMessage: "text3",
    mobileSortHelpModalHead: "text4",
    mobileSortHelpModalText: "text5",
    mobileSortScrollBottomModalHead: "text6",
    mobileSortScrollBottomModalText: "text7",
  };

  it("should transform all language keys correctly", () => {
    const { result } = renderHook(() => useTextLocalization(mockLangObj));

    // Verify a few key mappings
    expect(result.current.conditionsOfInstruction).toBe("parsed-decoded-text1");
    expect(result.current.helpModalHead).toBe("parsed-decoded-text4");
    expect(result.current.scrollBottomModalText).toBe("parsed-decoded-text7");
  });

  it("should memoize the result and not recompute if langObj is the same", () => {
    const { result, rerender } = renderHook(({ lang }) => useTextLocalization(lang), {
      initialProps: { lang: mockLangObj },
    });

    const firstValue = result.current;

    // Rerender with the exact same object reference
    rerender({ lang: mockLangObj });
    expect(result.current).toBe(firstValue);

    // Rerender with a new object reference but same data
    const newObj = { ...mockLangObj };
    rerender({ lang: newObj });
    expect(result.current).not.toBe(firstValue); // useMemo triggers on shallow ref change
  });
});

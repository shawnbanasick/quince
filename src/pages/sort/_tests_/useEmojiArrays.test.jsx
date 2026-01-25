import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useEmojiArrays } from "../mobileSortHooks/useEmojiArrays";

// 1. Mock the SVGs to avoid import errors and simplify snapshots
vi.mock("../../../assets/emojiN5.svg?react", () => ({
  default: () => <svg data-testid="EmojiN5" />,
}));
vi.mock("../../../assets/emojiN4.svg?react", () => ({
  default: () => <svg data-testid="EmojiN4" />,
}));
vi.mock("../../../assets/emojiN3.svg?react", () => ({
  default: () => <svg data-testid="EmojiN3" />,
}));
vi.mock("../../../assets/emojiN2.svg?react", () => ({
  default: () => <svg data-testid="EmojiN2" />,
}));
vi.mock("../../../assets/emojiN1.svg?react", () => ({
  default: () => <svg data-testid="EmojiN1" />,
}));
vi.mock("../../../assets/emoji0.svg?react", () => ({
  default: () => <svg data-testid="Emoji0" />,
}));
vi.mock("../../../assets/emoji1.svg?react", () => ({
  default: () => <svg data-testid="Emoji1" />,
}));
vi.mock("../../../assets/emoji2.svg?react", () => ({
  default: () => <svg data-testid="Emoji2" />,
}));
vi.mock("../../../assets/emoji3.svg?react", () => ({
  default: () => <svg data-testid="Emoji3" />,
}));
vi.mock("../../../assets/emoji4.svg?react", () => ({
  default: () => <svg data-testid="Emoji4" />,
}));
vi.mock("../../../assets/emoji5.svg?react", () => ({
  default: () => <svg data-testid="Emoji5" />,
}));

// 2. Mock UUID to have consistent keys during testing
vi.mock("uuid", () => ({
  v4: () => "test-uuid",
}));

describe("useEmojiArrays", () => {
  it("should return an empty array if mapObj is undefined or empty", () => {
    const { result } = renderHook(() => useEmojiArrays(null));
    expect(result.current.displayArray).toEqual([]);
  });

  it("should return emoji5Array when emojiArrayType is 'emoji5Array'", () => {
    const mapObj = { emojiArrayType: ["emoji5Array"] };
    const { result } = renderHook(() => useEmojiArrays(mapObj));

    // Check length (EmojiN5 to Emoji5 = 11 items)
    expect(result.current.displayArray).toHaveLength(11);
    // Verify the first element is the expected mock
    expect(result.current.displayArray[0].type.name).toBe("default");
  });

  it("should return emoji2Array with the correct subsets", () => {
    const mapObj = { emojiArrayType: ["emoji2Array"] };
    const { result } = renderHook(() => useEmojiArrays(mapObj));

    // emoji2Array has N2, N1, 0, 1, 2 (5 items)
    expect(result.current.displayArray).toHaveLength(5);
  });

  it("should memoize the displayArray and not recreate it if mapObj stays the same", () => {
    const mapObj = { emojiArrayType: ["emoji3Array"] };
    const { result, rerender } = renderHook(({ obj }) => useEmojiArrays(obj), {
      initialProps: { obj: mapObj },
    });

    const firstResult = result.current.displayArray;
    rerender({ obj: mapObj }); // Trigger rerender with same object reference

    expect(result.current.displayArray).toBe(firstResult);
  });

  it("should update displayArray when emojiArrayType changes", () => {
    let mapObj = { emojiArrayType: ["emoji2Array"] };
    const { result, rerender } = renderHook(({ obj }) => useEmojiArrays(obj), {
      initialProps: { obj: mapObj },
    });

    expect(result.current.displayArray).toHaveLength(5);

    mapObj = { emojiArrayType: ["emoji5Array"] };
    rerender({ obj: mapObj });

    expect(result.current.displayArray).toHaveLength(11);
  });
});

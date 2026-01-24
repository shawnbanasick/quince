import { describe, it, expect } from "vitest";
import createRightLeftArrays from "../createRightLeftArrays";

describe("createRightLeftArrays", () => {
  it("should split array and reverse right portion when maxIterations is less than array length", () => {
    const input = [1, 2, 3, 4, 5, 6];
    const maxIterations = 3;
    const [leftArray, rightArray] = createRightLeftArrays(input, maxIterations);

    expect(leftArray).toEqual([1, 2, 3]);
    expect(rightArray).toEqual([6, 5, 4]);
  });

  it("should handle maxIterations equal to array length", () => {
    const input = [1, 2, 3, 4];
    const maxIterations = 4;
    const [leftArray, rightArray] = createRightLeftArrays(input, maxIterations);

    expect(leftArray).toEqual([1, 2, 3, 4]);
    expect(rightArray).toEqual([4, 3, 2, 1]);
  });

  it("should handle maxIterations of 1", () => {
    const input = [1, 2, 3, 4, 5];
    const maxIterations = 1;
    const [leftArray, rightArray] = createRightLeftArrays(input, maxIterations);

    expect(leftArray).toEqual([1]);
    expect(rightArray).toEqual([5]);
  });

  it("should handle empty array", () => {
    const input = [];
    const maxIterations = 3;
    const [leftArray, rightArray] = createRightLeftArrays(input, maxIterations);

    expect(leftArray).toEqual([]);
    expect(rightArray).toEqual([]);
  });

  it("should handle maxIterations greater than array length", () => {
    const input = [1, 2, 3];
    const maxIterations = 10;
    const [leftArray, rightArray] = createRightLeftArrays(input, maxIterations);

    expect(leftArray).toEqual([1, 2, 3]);
    expect(rightArray).toEqual([3, 2, 1]);
  });

  it("should handle maxIterations of 0", () => {
    const input = [1, 2, 3, 4];
    const maxIterations = 0;
    const [leftArray, rightArray] = createRightLeftArrays(input, maxIterations);

    expect(leftArray).toEqual([]);
    expect(rightArray).toEqual([]);
  });

  it("should work with string arrays", () => {
    const input = ["a", "b", "c", "d", "e"];
    const maxIterations = 2;
    const [leftArray, rightArray] = createRightLeftArrays(input, maxIterations);

    expect(leftArray).toEqual(["a", "b"]);
    expect(rightArray).toEqual(["e", "d"]);
  });

  it("should work with object arrays", () => {
    const input = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const maxIterations = 2;
    const [leftArray, rightArray] = createRightLeftArrays(input, maxIterations);

    expect(leftArray).toEqual([{ id: 1 }, { id: 2 }]);
    expect(rightArray).toEqual([{ id: 4 }, { id: 3 }]);
  });

  it("should not mutate the original array", () => {
    const input = [1, 2, 3, 4, 5];
    const original = [...input];
    const maxIterations = 2;

    createRightLeftArrays(input, maxIterations);

    expect(input).toEqual(original);
  });

  it("should return two separate array instances", () => {
    const input = [1, 2, 3, 4];
    const maxIterations = 2;
    const [leftArray, rightArray] = createRightLeftArrays(input, maxIterations);

    expect(leftArray).not.toBe(rightArray);
  });
});

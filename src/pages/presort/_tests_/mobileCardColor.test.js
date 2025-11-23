import { describe, it, expect } from "vitest";
import mobileCardColor from "../mobileCardColor";

describe("mobileCardColor", () => {
  it("returns #31C48D for sortValue 4", () => {
    expect(mobileCardColor(4)).toBe("#31C48D");
  });

  it("returns #84E1BC for sortValue 3", () => {
    expect(mobileCardColor(3)).toBe("#84E1BC");
  });

  it("returns #BCF0DA for sortValue 2", () => {
    expect(mobileCardColor(2)).toBe("#BCF0DA");
  });

  it("returns #DEF7EC for sortValue 1", () => {
    expect(mobileCardColor(1)).toBe("#DEF7EC");
  });

  it("returns #F3F4F6 for sortValue 0", () => {
    expect(mobileCardColor(0)).toBe("#F3F4F6");
  });

  it("returns #FDE8E8 for sortValue -1", () => {
    expect(mobileCardColor(-1)).toBe("#FDE8E8");
  });

  it("returns #FBD5D5 for sortValue -2", () => {
    expect(mobileCardColor(-2)).toBe("#FBD5D5");
  });

  it("returns #F8B4B4 for sortValue -3", () => {
    expect(mobileCardColor(-3)).toBe("#F8B4B4");
  });

  it("returns #F98080 for sortValue -4", () => {
    expect(mobileCardColor(-4)).toBe("#F98080");
  });

  it("returns undefined for sortValue outside range (5)", () => {
    expect(mobileCardColor(5)).toBeUndefined();
  });

  it("returns undefined for sortValue outside range (-5)", () => {
    expect(mobileCardColor(-5)).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(mobileCardColor(null)).toBeUndefined();
  });

  it("returns undefined for undefined", () => {
    expect(mobileCardColor(undefined)).toBeUndefined();
  });

  it("returns undefined for non-numeric string", () => {
    expect(mobileCardColor("invalid")).toBeUndefined();
  });
});

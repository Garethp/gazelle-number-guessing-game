import { arraysAreEqual } from "./utils.js";

describe("Arrays Are Equal", () => {
  it("should return true if two arrays are equal", () => {
    expect(arraysAreEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it("should not care about duplicate values", () => {
    expect(arraysAreEqual([1, 2, 2, 3], [1, 2, 3])).toBe(true);
    expect(arraysAreEqual([1, 2, 3], [1, 2, 2, 3])).toBe(true);
  });

  it("should not care about order", () => {
    expect(arraysAreEqual([3, 2, 1], [1, 2, 3])).toBe(true);
  });
});

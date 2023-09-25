import { arrayContains, arraysAreEqual } from "./utils.js";

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

describe("Array Contains", () => {
  it("should return true of all items are in the array, even in a different order", () => {
    expect(arrayContains([1, 2, 3], [3, 2, 1])).toBe(true);
  });

  it("should return true if all items are in the array, even if the lengths arent equal", () => {
    expect(arrayContains([1, 2, 3], [2, 3])).toBe(true);
  });

  it("should return true even if there are repeated items", () => {
    expect(arrayContains([1, 2, 3], [1, 1])).toBe(true);
  });

  it("should return false if there are some missing items", () => {
    expect(arrayContains([1, 2, 3], [2, 3, 4])).toBe(false);
  });
});

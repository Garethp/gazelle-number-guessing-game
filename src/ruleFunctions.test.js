import {
  between,
  dividableBy,
  even,
  greaterThan,
  greaterThanInc,
  is,
  isPrime,
  lessThan,
  lessThanInc,
  not,
  notDividableBy,
  notRepeating,
  odd,
  repeating,
} from "./ruleFunctions";

describe("Rule Functions", () => {
  describe("Greater Than (Non-Inclusive)", () => {
    it("should return true if the number is greater than", () => {
      expect(greaterThan(1)(2)).toBe(true);
    });

    it("should return false if the number is equal", () => {
      expect(greaterThan(1)(1)).toBe(false);
    });

    it("should return false if the number is less than", () => {
      expect(greaterThan(2)(1)).toBe(false);
    });
  });

  describe("Greater Than (Inclusive)", () => {
    it("should return true if the number is greater than", () => {
      expect(greaterThanInc(1)(2)).toBe(true);
    });

    it("should return true if the number is equal", () => {
      expect(greaterThanInc(1)(1)).toBe(true);
    });

    it("should return false if the number is less than", () => {
      expect(greaterThanInc(2)(1)).toBe(false);
    });
  });

  describe("Less Than (Non-Inclusive)", () => {
    it("should return false if the number is greater than", () => {
      expect(lessThan(1)(2)).toBe(false);
    });

    it("should return false if the number is equal", () => {
      expect(lessThan(1)(1)).toBe(false);
    });

    it("should return true if the number is less than", () => {
      expect(lessThan(2)(1)).toBe(true);
    });
  });

  describe("Less Than (Inclusive)", () => {
    it("should return false if the number is greater than", () => {
      expect(lessThanInc(1)(2)).toBe(false);
    });

    it("should return true if the number is equal", () => {
      expect(lessThanInc(1)(1)).toBe(true);
    });

    it("should return true if the number is less than", () => {
      expect(lessThanInc(2)(1)).toBe(true);
    });
  });

  describe("Between", () => {
    it("should return false if number is equal to lower bracket", () => {
      expect(between(1, 3)(1)).toBe(false);
    });

    it("should return false if number is equal to upper bracket", () => {
      expect(between(1, 3)(3)).toBe(false);
    });

    it("should return true if number is between numbers", () => {
      expect(between(1, 3)(2)).toBe(true);
    });
  });

  describe("Odd/Even", () => {
    it("should detect even numbers", () => {
      expect(even()(10)).toBe(true);
      expect(odd()(10)).toBe(false);
    });

    it("should detect odd numbers", () => {
      expect(even()(11)).toBe(false);
      expect(odd()(11)).toBe(true);
    });
  });

  describe("Dividable By", () => {
    it("should detect if a number is dividable by another", () => {
      expect(dividableBy(10)(50)).toBe(true);
      expect(notDividableBy(10)(50)).toBe(false);
    });

    it("should detect if a number is not dividable by another", () => {
      expect(dividableBy(10)(51)).toBe(false);
      expect(notDividableBy(10)(51)).toBe(true);
    });
  });

  describe("Not", () => {
    it("should return true if number not in array", () => {
      expect(not(1, 2, 3)(4)).toBe(true);
    });

    it("should return false if number is in array", () => {
      expect(not(1, 2, 3, 4)(4)).toBe(false);
    });
  });

  describe("Is", () => {
    it("should return true if number is in array", () => {
      expect(is(1, 2, 3)(3)).toBe(true);
    });

    it("should return false if number is not in array", () => {
      expect(is(1, 2, 3)(4)).toBe(false);
    });
  });

  describe("Reapting", () => {
    it("should detect repeating numbers", () => {
      expect(repeating()(11)).toBe(true);
      expect(repeating()(22)).toBe(true);
      expect(repeating()(121)).toBe(true);
      expect(repeating()(1231)).toBe(true);
    });

    it("should not detect non-repeating numbers", () => {
      expect(repeating()(123)).toBe(false);
      expect(repeating()(12)).toBe(false);
      expect(repeating()(1)).toBe(false);
      expect(repeating()(123478)).toBe(false);
    });
  });

  describe("Non-Repeating", () => {
    it("should not detect repeating numbers", () => {
      expect(notRepeating()(11)).toBe(false);
      expect(notRepeating()(22)).toBe(false);
      expect(notRepeating()(121)).toBe(false);
      expect(notRepeating()(1231)).toBe(false);
    });

    it("should detect non-repeating numbers", () => {
      expect(notRepeating()(123)).toBe(true);
      expect(notRepeating()(12)).toBe(true);
      expect(notRepeating()(1)).toBe(true);
      expect(notRepeating()(123478)).toBe(true);
    });
  });

  describe("IsPrime", () => {
    test("should return false for non-prime numbers", () => {
      expect(isPrime()(-1)).toBeFalsy();
      expect(isPrime()(0)).toBeFalsy();
      expect(isPrime()(1)).toBeFalsy();
      expect(isPrime()(4)).toBeFalsy();
      expect(isPrime()(9)).toBeFalsy();

      expect(isPrime()(104730)).toBeFalsy();
      expect(isPrime()(1299710)).toBeFalsy();
    });

    test("should return true for prime numbers", () => {
      expect(isPrime()(2)).toBeTruthy();
      expect(isPrime()(3)).toBeTruthy();
      expect(isPrime()(5)).toBeTruthy();
      expect(isPrime()(7)).toBeTruthy();
      expect(isPrime()(11)).toBeTruthy();
      expect(isPrime()(13)).toBeTruthy();

      expect(isPrime()(104729)).toBeTruthy();
      expect(isPrime()(1299709)).toBeTruthy();
      expect(isPrime()(15485863)).toBeTruthy();
    });
  });
});

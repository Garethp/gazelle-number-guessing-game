import {
  askNewQuestion,
  createBetweenRule,
  createDigitIsRule,
  createDividableRule,
  createEvenRule,
  createGreaterThanRule,
  createIsNotPrimeRule,
  createIsPrimeRule,
  createIsRepeatingRule,
  createIsRule,
  createLessThanRule,
  createNotDividableRule,
  createNotIsRepeatingRule,
  createNotRule,
  createOddRule,
  createRules,
} from "./process.js";

describe("Ask New Question", () => {
  it("should check tens digit even true", () => {
    const rule = askNewQuestion("tens digit even?", 728348);

    expect(rule).not.toBeUndefined();
    expect(rule.constructor.name === "DigitIs");
    expect(rule.digitRule.constructor.name === "IsEven");
    expect(rule.toString()).toBe("Tens digit even");
  });

  it("should check tens digit odd false", () => {
    const rule = askNewQuestion("tens digit odd?", 728348);

    expect(rule).not.toBeUndefined();
    expect(rule.constructor.name === "DigitIs");
    expect(rule.digitRule.constructor.name === "IsEven");
  });
});

describe("Create Rules", () => {
  describe("Create Rules", () => {
    it("should return Rule Not Found for no rule", () => {
      expect(createRules("Something goes here").toString()).toEqual(
        "Rule not found for: Something goes here"
      );
    });

    it("should match multiple rules", () => {
      const results = createRules(
        [
          "726,900 < x < 728,500",
          "Hundreds digit odd",
          "Divisible by 4",
          "Thousands digit even",
          "Tens digit is 4",
          "x ≠ 728148, 728144, 728344, 726948",
          "Is Even",
          "Hundreds Digit 2 or 4",
          "Not divisible by 8",
          "Last digit 1, 7 or 9",
          "There are repeating digits",
          "There are no repeating digits",
        ].join("\n")
      );

      expect(
        results.map((result) => [result.constructor.name, ...result.inputs])
      ).toEqual([
        ["Between", 726900, 728500],
        ["DigitIs"],
        ["DividableBy", 4],
        ["DigitIs"],
        ["DigitIs"],
        ["Not", 728148, 728144, 728344, 726948],
        ["IsEven"],
        ["DigitIs"],
        ["NotDividableBy", 8],
        ["DigitIs"],
        ["IsRepeating"],
        ["IsNotRepeating"],
      ]);
    });
  });

  describe("Greater Than", () => {
    it("should match x>1", () => {
      const results = createGreaterThanRule("x>1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("GreaterThan");
      expect(results.inputs).toEqual([1]);
    });

    it("should match > 1", () => {
      const results = createGreaterThanRule("> 1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("GreaterThan");
      expect(results.inputs).toEqual([1]);
    });

    it("should match >1", () => {
      const results = createGreaterThanRule(">1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("GreaterThan");
      expect(results.inputs).toEqual([1]);
    });

    it("should match x>=1", () => {
      const results = createGreaterThanRule("x>=1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("GreaterThanInc");
      expect(results.inputs).toEqual([1]);
    });

    it("should match x=>1", () => {
      const results = createGreaterThanRule("x=>1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("GreaterThanInc");
      expect(results.inputs).toEqual([1]);
    });

    it("should match x≥1", () => {
      const results = createGreaterThanRule("x≥1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("GreaterThanInc");
      expect(results.inputs).toEqual([1]);
    });

    it("should match >=1", () => {
      const results = createGreaterThanRule(">=1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("GreaterThanInc");
      expect(results.inputs).toEqual([1]);
    });

    it("should match =>1", () => {
      const results = createGreaterThanRule("=>1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("GreaterThanInc");
      expect(results.inputs).toEqual([1]);
    });

    it("should match ≥1", () => {
      const results = createGreaterThanRule("≥1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("GreaterThanInc");
      expect(results.inputs).toEqual([1]);
    });
  });

  describe("Less Than", () => {
    it("should match x<1", () => {
      const results = createLessThanRule("x<1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("LessThan");
      expect(results.inputs).toEqual([1]);
    });

    it("should match < 1", () => {
      const results = createLessThanRule("< 1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("LessThan");
      expect(results.inputs).toEqual([1]);
    });

    it("should match <1", () => {
      const results = createLessThanRule("<1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("LessThan");
      expect(results.inputs).toEqual([1]);
    });

    it("should match x<=1", () => {
      const results = createLessThanRule("x<=1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("LessThanInc");
      expect(results.inputs).toEqual([1]);
    });

    it("should match x=<1", () => {
      const results = createLessThanRule("x=<1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("LessThanInc");
      expect(results.inputs).toEqual([1]);
    });

    it("should match x≤1", () => {
      const results = createLessThanRule("x≤1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("LessThanInc");
      expect(results.inputs).toEqual([1]);
    });

    it("should match <=1", () => {
      const results = createLessThanRule("<=1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("LessThanInc");
      expect(results.inputs).toEqual([1]);
    });

    it("should match =<1", () => {
      const results = createLessThanRule("=<1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("LessThanInc");
      expect(results.inputs).toEqual([1]);
    });

    it("should match ≤1", () => {
      const results = createLessThanRule("≤1");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("LessThanInc");
      expect(results.inputs).toEqual([1]);
    });
  });

  describe("Between", () => {
    it("should match 1 - 3", () => {
      const results = createBetweenRule("1 - 3");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("Between");
      expect(results.inputs).toEqual([1, 3]);
    });

    it("should match 1-3", () => {
      const results = createBetweenRule("1-3");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("Between");
      expect(results.inputs).toEqual([1, 3]);
    });

    it("should match 1 to 3", () => {
      const results = createBetweenRule("1 to 3");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("Between");
      expect(results.inputs).toEqual([1, 3]);
    });

    it("should match 1to3", () => {
      const results = createBetweenRule("1to3");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("Between");
      expect(results.inputs).toEqual([1, 3]);
    });

    it("should match 1 < x < 3", () => {
      expect(createBetweenRule("1 < x < 3")).not.toBeUndefined();
    });

    it("should match 1<x<3", () => {
      expect(createBetweenRule("1< x < 3")).not.toBeUndefined();
    });

    it("should match 1 <= x < 3", () => {
      expect(createBetweenRule("1 <= x < 3")).not.toBeUndefined();
    });

    it("should match 1<=x<3", () => {
      expect(createBetweenRule("1<=x<3")).not.toBeUndefined();
    });

    it("should match 1 < x <= 3", () => {
      expect(createBetweenRule("1 < x <= 3")).not.toBeUndefined();
    });

    it("should match 1<x<=3", () => {
      expect(createBetweenRule("1<x<=3")).not.toBeUndefined();
    });

    it("should match 1 <= x <= 3", () => {
      const results = createBetweenRule("1 <= x <= 3");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("BetweenInc");
      expect(results.inputs).toEqual([1, 3]);
    });

    it("should match 1 ≤ x ≤ 3", () => {
      const results = createBetweenRule("should match 1 ≤ x ≤ 3");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("BetweenInc");
      expect(results.inputs).toEqual([1, 3]);
    });

    it("should match 1 =< x =< 3", () => {
      const results = createBetweenRule("1 =< x =< 3");

      expect(results).not.toBeUndefined();
      expect(results.constructor.name).toBe("BetweenInc");
      expect(results.inputs).toEqual([1, 3]);
    });

    it("should match 1<=x<=3", () => {
      expect(createBetweenRule("1<=x<=3")).not.toBeUndefined();
    });

    it("should match between 1 and 3", () => {
      expect(createBetweenRule("between 1 and 3")).not.toBeUndefined();
    });

    it("should match Between 1 And 3", () => {
      expect(createBetweenRule("Between 1 And 3")).not.toBeUndefined();
    });
  });

  describe("Even Rule", () => {
    it("should match is even", () => {
      expect(createEvenRule("is even")).not.toBeUndefined();
    });

    it("should match Is Even", () => {
      expect(createEvenRule("Is Even")).not.toBeUndefined();
    });

    it("should match Even", () => {
      expect(createEvenRule("Even")).not.toBeUndefined();
    });

    it("should match even", () => {
      expect(createEvenRule("even")).not.toBeUndefined();
    });

    it("should not match Tens digit even", () => {
      expect(createEvenRule("Tens digit even")).toBeUndefined();
    });
  });

  describe("Odd Rule", () => {
    it("should match is odd", () => {
      expect(createOddRule("is odd")).not.toBeUndefined();
    });

    it("should match Is Odd", () => {
      expect(createOddRule("Is Odd")).not.toBeUndefined();
    });

    it("should match Odd", () => {
      expect(createOddRule("Odd")).not.toBeUndefined();
    });

    it("should match odd", () => {
      expect(createOddRule("odd")).not.toBeUndefined();
    });

    it("should not match Tens digit odd", () => {
      expect(createOddRule("Tens digit odd")).toBeUndefined();
    });
  });

  describe("Dividable Rule", () => {
    it("should match dividable by 4", () => {
      const result = createDividableRule("dividable by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Dividable by 4");
    });

    it("should match Dividable by 4", () => {
      const result = createDividableRule("Dividable by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Dividable by 4");
    });

    it("should match is dividable by 4", () => {
      const result = createDividableRule("Dividable by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Dividable by 4");
    });

    it("should match Is Dividable by 4", () => {
      const result = createDividableRule("Is Dividable by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Dividable by 4");
    });

    it("should match divisible by 4", () => {
      const result = createDividableRule("Dividable by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Dividable by 4");
    });

    it("should match is divisible by 4", () => {
      const result = createDividableRule("is divisible by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Dividable by 4");
    });

    it("should match is a multiple of 4", () => {
      const result = createDividableRule("a multiple of 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Dividable by 4");
    });

    it("should not match tens digit is divisible by 4", () => {
      const result = createDividableRule("tens digit is divisible by 4");

      expect(result).toBeUndefined();
    });

    it("should not match tens digit is dividable by 4", () => {
      const result = createDividableRule("tens digit is dividable by 4");

      expect(result).toBeUndefined();
    });

    it("should not match dividable by abc", () => {
      const result = createDividableRule("tens digit is dividable by abc");

      expect(result).toBeUndefined();
    });

    it("should not match not dividable by 8", () => {
      const result = createDividableRule("not dividable by 8");

      expect(result).toBeUndefined();
    });

    it("should not match not multiple of 8", () => {
      const result = createDividableRule("not multiple of 8");

      expect(result).toBeUndefined();
    });
  });

  describe("Not Dividable Rule", () => {
    it("should match not dividable by 4", () => {
      const result = createNotDividableRule("not dividable by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Not dividable by 4");
    });

    it("should match not Dividable by 4", () => {
      const result = createNotDividableRule("not Dividable by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Not dividable by 4");
    });

    it("should match is not dividable by 4", () => {
      const result = createNotDividableRule("is not dividable by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Not dividable by 4");
    });

    it("should match Is not Dividable by 4", () => {
      const result = createNotDividableRule("Is not Dividable by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Not dividable by 4");
    });

    it("should match not divisible by 4", () => {
      const result = createNotDividableRule("not divisible by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Not dividable by 4");
    });

    it("should match is not divisible by 4", () => {
      const result = createNotDividableRule("is not divisible by 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Not dividable by 4");
    });

    it("should match is not multiple of 4", () => {
      const result = createNotDividableRule("is not multiple of 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([4]);
      expect(result.toString()).toBe("Not dividable by 4");
    });

    it("should not match is multiple of 4", () => {
      const result = createNotDividableRule("is multiple of 4");

      expect(result).toBeUndefined();
    });

    it("should not match tens digit is multiple of 4", () => {
      const result = createNotDividableRule("tens digit is multiple of 4");

      expect(result).toBeUndefined();
    });

    it("should not match tens digit is not divisible by 4", () => {
      const result = createNotDividableRule("tens digit is not divisible by 4");

      expect(result).toBeUndefined();
    });

    it("should not match tens digit is not dividable by 4", () => {
      const result = createNotDividableRule("tens digit is not dividable by 4");

      expect(result).toBeUndefined();
    });

    it("should not match is not dividable by abc", () => {
      const result = createNotDividableRule(
        "tens digit is not dividable by abc"
      );

      expect(result).toBeUndefined();
    });
  });

  describe("Not", () => {
    it("should match not 1", () => {
      const result = createNotRule("not 1");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1]);
      expect(result.toString()).toEqual("Not 1");
    });

    it("should match x ≠ 1", () => {
      const result = createNotRule("x ≠ 1");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1]);
      expect(result.toString()).toEqual("Not 1");
    });

    it("should match x is not 1", () => {
      const result = createNotRule("x is not 1");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1]);
      expect(result.toString()).toEqual("Not 1");
    });

    it("should match ≠ 1", () => {
      const result = createNotRule("≠ 1");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1]);
      expect(result.toString()).toEqual("Not 1");
    });

    it("should match not 1, 2, 3", () => {
      const result = createNotRule("not 1, 2, 3");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1, 2, 3]);
      expect(result.toString()).toEqual("Not 1 or 2 or 3");
    });

    it("should match is not 1, 2, 3", () => {
      const result = createNotRule("is not 1, 2, 3");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1, 2, 3]);
      expect(result.toString()).toEqual("Not 1 or 2 or 3");
    });

    it("should match not 1, 2 or 3", () => {
      const result = createNotRule("not 1, 2 or 3");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1, 2, 3]);
      expect(result.toString()).toEqual("Not 1 or 2 or 3");
    });

    it("should match not 1 or 2 or 3", () => {
      const result = createNotRule("not 1 or 2 or 3");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1, 2, 3]);
      expect(result.toString()).toEqual("Not 1 or 2 or 3");
    });

    it("should match Not 1 OR 2 or 3", () => {
      const result = createNotRule("Not 1 OR 2 or 3");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1, 2, 3]);
      expect(result.toString()).toEqual("Not 1 or 2 or 3");
    });

    it("should not match Not abc", () => {
      const result = createNotRule("Not abc");

      expect(result).toBeUndefined();
    });
  });

  describe("Is", () => {
    it("should match is 1", () => {
      const result = createIsRule("is 1");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1]);
      expect(result.toString()).toEqual("Is 1");
    });

    it("should match 1", () => {
      const result = createIsRule("1");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1]);
      expect(result.toString()).toEqual("Is 1");
    });

    it("should match 1 or 4", () => {
      const result = createIsRule("1 or 4");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1, 4]);
      expect(result.toString()).toEqual("Is 1 or 4");
    });

    it("should match is 1, 2, 3", () => {
      const result = createIsRule("Is 1 or 2 or 3");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1, 2, 3]);
      expect(result.toString()).toEqual("Is 1 or 2 or 3");
    });

    it("should match is 1, 2 or 3", () => {
      const result = createIsRule("is 1, 2 or 3");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1, 2, 3]);
      expect(result.toString()).toEqual("Is 1 or 2 or 3");
    });

    it("should match is 1 or 2 or 3", () => {
      const result = createIsRule("is 1 or 2 or 3");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1, 2, 3]);
      expect(result.toString()).toEqual("Is 1 or 2 or 3");
    });

    it("should match Is 1 OR 2 or 3", () => {
      const result = createIsRule("Is 1 OR 2 or 3");

      expect(result).not.toBeUndefined();
      expect(result.inputs).toEqual([1, 2, 3]);
      expect(result.toString()).toEqual("Is 1 or 2 or 3");
    });

    it("should not match Is abc", () => {
      const result = createIsRule("Is abc");

      expect(result).toBeUndefined();
    });
  });

  describe("DigitIs Rule", () => {
    it("should not match a non-existent rule", () => {
      const result = createDigitIsRule("last digit does not have a rule");

      expect(result).toBeUndefined();
    });

    it("should not match a non-existent digit name", () => {
      const result = createDigitIsRule("random digit is even");

      expect(result).toBeUndefined();
    });

    it("should match tens digit is between 1 and 3", () => {
      const result = createDigitIsRule("tens digit is between 1 and 3");

      expect(result).not.toBeUndefined();
      expect(result.digitName).toBe("tens");
      expect(result.digitRule.constructor.name).toBe("Between");
      expect(result.digitRule.inputs).toEqual([1, 3]);
    });

    it("should match ones digit is even", () => {
      const result = createDigitIsRule("ones digit is even");

      expect(result).not.toBeUndefined();
      expect(result.digitName).toBe("ones");
      expect(result.digitRule.constructor.name).toBe("IsEven");
    });

    it("should match hundreds digit is odd", () => {
      const result = createDigitIsRule("hundreds digit is odd");

      expect(result).not.toBeUndefined();
      expect(result.digitName).toBe("hundreds");
      expect(result.digitRule.constructor.name).toBe("IsOdd");
    });

    it("should match last digit is dividable by 3", () => {
      const result = createDigitIsRule("last digit is dividable by 3");

      expect(result).not.toBeUndefined();
      expect(result.digitName).toBe("ones");
      expect(result.digitRule.constructor.name).toBe("DividableBy");
      expect(result.digitRule.inputs).toEqual([3]);
    });

    it("should match thousands digit is not dividable by 3", () => {
      const result = createDigitIsRule("thousands digit is not dividable by 3");

      expect(result).not.toBeUndefined();
      expect(result.digitName).toBe("thousands");
      expect(result.digitRule.constructor.name).toBe("NotDividableBy");
      expect(result.digitRule.inputs).toEqual([3]);
    });

    it("should match ten-thousands digit not 3", () => {
      const result = createDigitIsRule("ten-thousands digit not 3");

      expect(result).not.toBeUndefined();
      expect(result.digitName).toBe("ten-thousands");
      expect(result.digitRule.constructor.name).toBe("Not");
      expect(result.digitRule.inputs).toEqual([3]);
    });

    it("should match hundred-thousands digit 3", () => {
      const result = createDigitIsRule("hundred-thousands digit 3");

      expect(result).not.toBeUndefined();
      expect(result.digitName).toBe("hundred-thousands");
      expect(result.digitRule.constructor.name).toBe("Is");
      expect(result.digitRule.inputs).toEqual([3]);
    });

    it("should match millions digit 3", () => {
      const result = createDigitIsRule("millions digit 3");

      expect(result).not.toBeUndefined();
      expect(result.digitName).toBe("millions");
      expect(result.digitRule.constructor.name).toBe("Is");
      expect(result.digitRule.inputs).toEqual([3]);
    });
  });

  describe("Repeating Rule", () => {
    it("should detect is repeating", () => {
      const result = createIsRepeatingRule("is repeating");

      expect(result).not.toBeUndefined();
      expect(result.constructor.name).toBe("IsRepeating");
    });

    it("should detect repeating", () => {
      const result = createIsRepeatingRule("repeating");

      expect(result).not.toBeUndefined();
      expect(result.constructor.name).toBe("IsRepeating");
    });

    it("should detect repeats", () => {
      const result = createIsRepeatingRule("repeats");

      expect(result).not.toBeUndefined();
      expect(result.constructor.name).toBe("IsRepeating");
    });

    it("should not detect not repeating", () => {
      const result = createIsRepeatingRule("not repeating");

      expect(result).toBeUndefined();
    });

    it("should not detect is not repeating", () => {
      const result = createIsRepeatingRule("is not repeating");

      expect(result).toBeUndefined();
    });

    it("should not detect not repeats", () => {
      const result = createIsRepeatingRule("not repeats");

      expect(result).toBeUndefined();
    });

    it("should not detect does not repeat", () => {
      const result = createIsRepeatingRule("does not repeat");

      expect(result).toBeUndefined();
    });

    it("should not detect no repeat", () => {
      const result = createIsRepeatingRule("no repeat");

      expect(result).toBeUndefined();
    });
  });

  describe("NotRepeating Rule", () => {
    it("should not detect is repeating", () => {
      const result = createNotIsRepeatingRule("is repeating");

      expect(result).toBeUndefined();
    });

    it("should not detect repeating", () => {
      const result = createNotIsRepeatingRule("repeating");

      expect(result).toBeUndefined();
    });

    it("should not detect repeats", () => {
      const result = createNotIsRepeatingRule("repeats");

      expect(result).toBeUndefined();
    });

    it("should detect not repeating", () => {
      const result = createNotIsRepeatingRule("not repeating");

      expect(result).not.toBeUndefined();
      expect(result.constructor.name).toBe("IsNotRepeating");
    });

    it("should detect is not repeating", () => {
      const result = createNotIsRepeatingRule("is not repeating");

      expect(result).not.toBeUndefined();
      expect(result.constructor.name).toBe("IsNotRepeating");
    });

    it("should detect not repeats", () => {
      const result = createNotIsRepeatingRule("not repeats");

      expect(result).not.toBeUndefined();
      expect(result.constructor.name).toBe("IsNotRepeating");
    });

    it("should detect does not repeat", () => {
      const result = createNotIsRepeatingRule("does not repeat");

      expect(result).not.toBeUndefined();
      expect(result.constructor.name).toBe("IsNotRepeating");
    });

    it("should detect does no repeat", () => {
      const result = createNotIsRepeatingRule("does no repeat");

      expect(result).not.toBeUndefined();
      expect(result.constructor.name).toBe("IsNotRepeating");
    });
  });

  describe("Is Prime Rule", () => {
    it("should detect is a prime number", () => {
      const result = createIsPrimeRule("is a prime number");

      expect(result).not.toBeUndefined();
      expect(result.constructor.name).toBe("IsPrime");
    });

    it("should not detect is not a prime number", () => {
      const result = createIsPrimeRule("is not a prime number");

      expect(result).toBeUndefined();
    });
  });

  describe("Is NotPrime Rule", () => {
    it("should detect is not a prime number", () => {
      const result = createIsNotPrimeRule("is not a prime number");

      expect(result).not.toBeUndefined();
      expect(result.constructor.name).toBe("IsNotPrime");
    });

    it("should not detect is a prime number", () => {
      const result = createIsNotPrimeRule("is a prime number");

      expect(result).toBeUndefined();
    });
  });
});

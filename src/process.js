import {
  Between,
  BetweenInc,
  BetweenLowerInc,
  BetweenUpperInc,
  DigitIs,
  DividableBy,
  GreaterThan,
  GreaterThanInc,
  Is,
  IsEven,
  IsNotPrime,
  IsNotRepeating,
  IsOdd,
  IsPrime,
  IsRepeating,
  LessThan,
  LessThanInc,
  NoOpRule,
  Not,
  NotDividableBy,
  Rule,
  RuleNotFound,
} from "./rules.js";

/**
 * @param {string} input
 * @param {number} number
 *
 * @return Rule
 */
export const askNewQuestion = (input, number) => {
  input = input.replaceAll("?", "").replace("？", "");
  const rule = createRule(input);

  if (rule.constructor.name === "RuleNotFound") {
    return rule;
  }

  return rule.createCorrection(number);
};

/**
 * @param {string} input
 *
 * @return Rule[]
 */
export const createRules = (input) => {
  return input.split("\n").map((input) => createRule(input));
};

/**
 * @param {string} input
 * @return {Rule}
 */
export const createRule = (input) => {
  input = input.trim().replaceAll("'", "");

  if (!input.length) return new NoOpRule();
  if (input.match(/^HP/i)) return new NoOpRule();

  return (
    createBetweenRule(input) ??
    createGreaterThanRule(input) ??
    createLessThanRule(input) ??
    createEvenRule(input) ??
    createOddRule(input) ??
    createDividableRule(input) ??
    createNotDividableRule(input) ??
    createNotRule(input) ??
    createIsRule(input) ??
    createIsRepeatingRule(input) ??
    createNotIsRepeatingRule(input) ??
    createDigitIsRule(input) ??
    createIsPrimeRule(input) ??
    createIsNotPrimeRule(input) ??
    new RuleNotFound(input)
  );
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createGreaterThanRule = (input) => {
  input = input
    .replaceAll(/\s+/g, "")
    .replaceAll("=>", ">=")
    .replaceAll("≥", ">=");

  if (input.match(/(?:[a-zA-Z])?>([\d,]+)/)) {
    const [_, number] = input.match(/(?:[a-zA-Z])?>([\d,]+)/);

    return new GreaterThan(number);
  }

  if (input.match(/(?:[a-zA-Z])?>=([\d,]+)/)) {
    const [_, number] = input.match(/(?:[a-zA-Z])?>=([\d,]+)/);

    return new GreaterThanInc(number);
  }
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createLessThanRule = (input) => {
  input = input
    .replaceAll(/\s+/g, "")
    .replaceAll("=<", "<=")
    .replaceAll("≤", "<=");

  if (input.match(/(?:[a-zA-Z])?<([\d,]+)/)) {
    const [_, number] = input.match(/(?:[a-zA-Z])?<([\d,]+)/);

    return new LessThan(number);
  }

  if (input.match(/(?:[a-zA-Z])?<=([\d,]+)/)) {
    const [_, number] = input.match(/(?:[a-zA-Z])?<=([\d,]+)/);

    return new LessThanInc(number);
  }
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createBetweenRule = (input) => {
  input = input
    .replaceAll(/\s+/g, "")
    .replaceAll("≤", "<=")
    .replaceAll("=<", "<=");

  if (input.match(/([\d,]+)-([\d,]+)/)) {
    const [_, lower, upper] = input.match(/([\d,]+)-([\d,]+)/);

    return new Between(lower, upper);
  }

  if (input.match(/([\d,]+)to([\d,]+)/)) {
    const [_, lower, upper] = input.match(/([\d,]+)to([\d,]+)/);

    return new Between(lower, upper);
  }

  if (input.match(/([\d,]+)<[a-zA-Z0-9]+<([\d,]+)/)) {
    const [_, lower, upper] = input.match(/([\d,]+)<[a-zA-Z0-9]+<([\d,]+)/);

    return new Between(lower, upper);
  }

  if (input.match(/([\d,]+)<=[a-zA-Z0-9]+<([\d,]+)/)) {
    const [_, lower, upper] = input.match(/([\d,]+)<=[a-zA-Z0-9]+<([\d,]+)/);

    return new BetweenLowerInc(lower, upper);
  }

  if (input.match(/([\d,]+)<[a-zA-Z0-9]+<=([\d,]+)/)) {
    const [_, lower, upper] = input.match(/([\d,]+)<[a-zA-Z0-9]+<=([\d,]+)/);

    return new BetweenUpperInc(lower, upper);
  }

  if (input.match(/([\d,]+)<=[a-zA-Z0-9]+<=([\d,]+)/)) {
    const [_, lower, upper] = input.match(/([\d,]+)<=[a-zA-Z0-9]+<=([\d,]+)/);

    return new BetweenInc(lower, upper);
  }

  if (input.match(/between([\d,]+)and([\d,]+)/i)) {
    const [_, lower, upper] = input.match(/between([\d,]+)and([\d,]+)/i);

    return new Between(lower, upper);
  }
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createEvenRule = (input) => {
  if (input.match(/^(is )?even$/i)) {
    return new IsEven();
  }
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createOddRule = (input) => {
  if (input.match(/^(is )?odd$/i)) {
    return new IsOdd();
  }
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createDividableRule = (input) => {
  if (input.match(/^(?:is )?dividable by ([\d,]+)$/i)) {
    const [_, divisor] = input.match(/^(?:is )?dividable by ([\d,]+)$/i);

    if (isNaN(parseInt(divisor))) return;

    return new DividableBy(divisor);
  }

  if (input.match(/^(?:is )?(?:a )?multiple of ([\d,]+)$/i)) {
    const [_, divisor] = input.match(/^(?:is )?(?:a )?multiple of ([\d,]+)$/i);

    if (isNaN(parseInt(divisor))) return;

    return new DividableBy(divisor);
  }

  if (input.match(/^(?:is )?divisible by ([\d,]+)$/i)) {
    const [_, divisor] = input.match(/^(?:is )?divisible by ([\d,]+)$/i);

    if (isNaN(parseInt(divisor))) return;

    return new DividableBy(divisor);
  }
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createNotDividableRule = (input) => {
  if (input.match(/^(?:is )?not dividable by ([\d,]+)$/i)) {
    const [_, divisor] = input.match(/^(?:is )?not dividable by ([\d,]+)$/i);

    if (isNaN(parseInt(divisor))) return;

    return new NotDividableBy(divisor);
  }

  if (input.match(/^(?:is )?not (?:a )?multiple of ([\d,]+)$/i)) {
    const [_, divisor] = input.match(
      /^(?:is )?not (?:a )?multiple of ([\d,]+)$/i
    );

    if (isNaN(parseInt(divisor))) return;

    return new NotDividableBy(divisor);
  }

  if (input.match(/^(?:is )?not divisible by ([\d,]+)$/i)) {
    const [_, divisor] = input.match(/^(?:is )?not divisible by ([\d,]+)$/i);
    if (isNaN(parseInt(divisor))) return;

    return new NotDividableBy(divisor);
  }
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createNotRule = (input) => {
  input = input.toLowerCase();
  input = input.replace("≠", "not");

  // Check for something like x is not ...
  if (!input.match(/^(\S+\s*)?(is\s*)?not/)) return;
  input = input.replace(/^(\S+\s*)?(is\s*)?not/, "not");

  input = input.replaceAll(/\s*/g, "");

  if (!input.match(/^(is)?not[0-9or]+/)) return;

  const unparsedNumbers = input
    .replace("isnot", "")
    .replace("not", "")
    .replaceAll(/or/g, ",")
    .split(",");

  if (unparsedNumbers.some((number) => isNaN(parseInt(number)))) return;

  return new Not(...unparsedNumbers);
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createIsRule = (input) => {
  input = input.toLowerCase().replaceAll(/\s*/g, "");

  if (!input.match(/^(?:is)?[0-9or]+/)) return;

  const unparsedNumbers = input
    .replace("is", "")
    .replaceAll(/or/g, ",")
    .split(",");

  if (unparsedNumbers.some((number) => isNaN(parseInt(number)))) return;

  return new Is(...unparsedNumbers);
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createDigitIsRule = (input) => {
  if (!input.match(/^(\S+)\s+digit\s+(.*?)$/i)) return;

  const [_, digitName, ruleString] = input.match(/^(\S+)\s+digit\s+(.*?)$/i);
  const rule = createRule(ruleString);

  if (rule.constructor.name === "RuleNotFound") return;

  let correctDigitName = "";

  const digitMatchers = [
    {
      index: 0,
      digitName: "ones",
      matchers: [/^ones?$/i, /^last$/i, /^singles?$/i],
    },
    {
      index: 1,
      digitName: "tens",
      matchers: [/^tens?$/i, /^second$/i],
    },
    {
      index: 2,
      digitName: "hundreds",
      matchers: [/^hundreds?$/i, /^third$/i],
    },
    {
      index: 3,
      digitName: "thousands",
      matchers: [/^thousands?$/i, /^fourth$/i],
    },
    {
      index: 4,
      digitName: "ten-thousands",
      matchers: [/^ten-thousands?$/i, /^ten\sthousands?$/i, /^fifth$/i],
    },
    {
      index: 5,
      digitName: "hundred-thousands",
      matchers: [/^hundred-thousands?$/i, /^hundred\sthousands?$/i, /^sixth$/i],
    },
    {
      index: 6,
      digitName: "millions",
      matchers: [/^millions?$/i, /^seventh$/i],
    },
  ];

  const matchedDigit = digitMatchers.find((digitMatcher) =>
    digitMatcher.matchers.some((matcher) => matcher.test(digitName))
  );

  if (!matchedDigit) return;

  return new DigitIs(matchedDigit.digitName, matchedDigit.index, rule);
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createIsRepeatingRule = (input) => {
  if (input.match(/no/) || !input.match(/repeat/)) return;

  return new IsRepeating();
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createNotIsRepeatingRule = (input) => {
  if (!input.match(/no/) || !input.match(/repeat/)) return;

  return new IsNotRepeating();
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createIsPrimeRule = (input) => {
  if (input.match(/no/) || !input.match(/prime/)) return;

  return new IsPrime();
};

/**
 * @param {string} input
 * @return {Rule | undefined}
 */
export const createIsNotPrimeRule = (input) => {
  if (!input.match(/no/) || !input.match(/prime/)) return;

  return new IsNotPrime();
};

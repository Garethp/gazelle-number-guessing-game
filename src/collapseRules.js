import {
  Between,
  BetweenInc,
  BetweenLowerInc,
  BetweenUpperInc,
  DividableBy,
  GreaterThan,
  GreaterThanInc,
  Is,
  IsEven,
  IsOdd,
  LessThan,
  LessThanInc,
  Not,
  NotDividableBy,
  Rule,
  DigitIs,
} from "./rules.js";
import { arraysAreEqual } from "./utils.js";

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const expand = (rules, digitIsRule = false) => {
  const isOdd = rules.find((rule) => rule.constructor.name === "IsOdd");
  if (isOdd) {
    rules = [...rules.filter((rule) => rule.constructor.name !== "IsOdd")];
    rules.push(new NotDividableBy(2));

    if (digitIsRule === true) {
      rules.push(new Is(1, 3, 5, 7, 9));
      rules.push(new Not(0, 2, 4, 6, 8));
    }
  }

  const isEven = rules.find((rule) => rule.constructor.name === "IsEven");
  if (isEven) {
    rules = [...rules.filter((rule) => rule.constructor.name !== "IsEven")];
    rules.push(new DividableBy(2));

    if (digitIsRule === true) {
      rules.push(new Is(0, 2, 4, 6, 8));
      rules.push(new Not(1, 3, 5, 7, 9));
    }
  }

  const between = rules.find((rule) => rule.constructor.name === "Between");
  if (between) {
    rules = [...rules.filter((rule) => rule.constructor.name !== "Between")];
    rules.push(new GreaterThan(between.inputs[0]));
    rules.push(new LessThan(between.inputs[1]));
  }

  const betweenLowerInc = rules.find(
    (rule) => rule.constructor.name === "BetweenLowerInc"
  );
  if (betweenLowerInc) {
    rules = [
      ...rules.filter((rule) => rule.constructor.name !== "BetweenLowerInc"),
    ];
    rules.push(new GreaterThanInc(betweenLowerInc.inputs[0]));
    rules.push(new LessThan(betweenLowerInc.inputs[1]));
  }

  const betweenUpperInc = rules.find(
    (rule) => rule.constructor.name === "BetweenUpperInc"
  );
  if (betweenUpperInc) {
    rules = [
      ...rules.filter((rule) => rule.constructor.name !== "BetweenUpperInc"),
    ];
    rules.push(new GreaterThan(betweenUpperInc.inputs[0]));
    rules.push(new LessThanInc(betweenUpperInc.inputs[1]));
  }

  const betweenInc = rules.find(
    (rule) => rule.constructor.name === "BetweenInc"
  );
  if (betweenInc) {
    rules = [...rules.filter((rule) => rule.constructor.name !== "BetweenInc")];
    rules.push(new GreaterThanInc(betweenInc.inputs[0]));
    rules.push(new LessThanInc(betweenInc.inputs[1]));
  }

  return rules;
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapse = (rules, digitIsRule = false) => {
  rules = expand(rules, digitIsRule);

  const collapses = [
    collapseGreaterThanIncRules,
    collapseLessThanIncRules,

    collapseGreaterThanRules,
    collapseLessThanRules,

    // This requires the GreaterThans and LessThans to already be collapsed
    collapseBetween,

    collapseDividableBy,
    collapseNotDividableBy,

    collapseNot,
    collapseIs,

    // This needs to run after the DividableBy and Is groups since it requires those to already be collapsed
    collapseIsEven,
    collapseIsOdd,

    collapseDigitIs,
  ];

  for (const operation of collapses) {
    rules = operation(rules, digitIsRule);
  }

  return rules;
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseGreaterThanRules = (rules, digitIsRule = false) => {
  if (
    rules.filter((rule) => rule.constructor.name === "GreaterThan").length <= 1
  )
    return rules;

  const sorted = rules
    .filter(
      (rule) =>
        rule.constructor.name === "GreaterThan" ||
        rule.constructor.name === "GreaterThanInc"
    )
    .sort((a, b) => {
      if (b.inputs[0] === a.inputs[0]) {
        return a.constructor.name.length - b.constructor.name.length;
      }

      return b.inputs[0] - a.inputs[0];
    });

  return [
    ...rules.filter(
      (rule) =>
        rule.constructor.name !== "GreaterThan" &&
        rule.constructor.name !== "GreaterThanInc"
    ),
    sorted[0],
  ];
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseGreaterThanIncRules = (rules, digitIsRule = false) => {
  if (
    rules.filter((rule) => rule.constructor.name === "GreaterThanInc")
      .length === 0
  )
    return rules;

  const sorted = rules
    .filter((rule) => rule.constructor.name === "GreaterThanInc")
    .sort((a, b) => b.inputs[0] - a.inputs[0]);

  return [
    ...rules.filter((rule) => rule.constructor.name !== "GreaterThanInc"),
    sorted[0],
  ];
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseLessThanRules = (rules, digitIsRule = false) => {
  if (rules.filter((rule) => rule.constructor.name === "LessThan").length === 0)
    return rules;

  const sorted = rules
    .filter(
      (rule) =>
        rule.constructor.name === "LessThan" ||
        rule.constructor.name === "LessThanInc"
    )
    .sort((a, b) => {
      if (a.inputs[0] === b.inputs[0]) {
        return a.constructor.name.length - b.constructor.name.length;
      }

      return a.inputs[0] - b.inputs[0];
    });

  return [
    ...rules.filter(
      (rule) =>
        rule.constructor.name !== "LessThan" &&
        rule.constructor.name !== "LessThanInc"
    ),
    sorted[0],
  ];
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseLessThanIncRules = (rules, digitIsRule = false) => {
  if (
    rules.filter((rule) => rule.constructor.name === "LessThanInc").length <= 1
  )
    return rules;

  const sorted = rules
    .filter((rule) => rule.constructor.name === "LessThanInc")
    .sort((a, b) => a.inputs[0] - b.inputs[0]);

  return [
    ...rules.filter((rule) => rule.constructor.name !== "LessThanInc"),
    sorted[0],
  ];
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseBetween = (rules, digitIsRule = false) => {
  const upper = rules.find(
    (rule) =>
      rule.constructor.name === "LessThan" ||
      rule.constructor.name === "LessThanInc"
  );

  const lower = rules.find(
    (rule) =>
      rule.constructor.name === "GreaterThan" ||
      rule.constructor.name === "GreaterThanInc"
  );

  if (!upper || !lower) return rules;

  const values = [lower.inputs[0], upper.inputs[0]];

  let betweenRule;

  if (
    upper.constructor.name.indexOf("Inc") > -1 &&
    lower.constructor.name.indexOf("Inc") > -1
  ) {
    betweenRule = new BetweenInc(...values);
  } else if (
    upper.constructor.name.indexOf("Inc") === -1 &&
    lower.constructor.name.indexOf("Inc") > -1
  ) {
    betweenRule = new BetweenLowerInc(...values);
  } else if (
    upper.constructor.name.indexOf("Inc") > -1 &&
    lower.constructor.name.indexOf("Inc") === -1
  ) {
    betweenRule = new BetweenUpperInc(...values);
  } else {
    betweenRule = new Between(...values);
  }

  return [
    ...rules.filter(
      (rule) =>
        ["LessThan", "LessThanInc", "GreaterThan", "GreaterThanInc"].indexOf(
          rule.constructor.name
        ) === -1
    ),
    betweenRule,
  ];
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseDividableBy = (rules, digitIsRule = false) => {
  if (
    rules.filter((rule) => rule.constructor.name === "DividableBy").length <= 1
  )
    return rules;

  let values = [];
  rules
    .filter((rule) => rule.constructor.name === "DividableBy")
    .forEach((rule) => {
      values = [...values, ...rule.inputs];
    });

  values = [...new Set(values)];

  return [
    ...rules.filter((rule) => rule.constructor.name !== "DividableBy"),
    new DividableBy(...values),
  ];
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseNotDividableBy = (rules, digitIsRule = false) => {
  if (
    rules.filter((rule) => rule.constructor.name === "NotDividableBy").length <=
    1
  )
    return rules;

  let values = [];
  rules
    .filter((rule) => rule.constructor.name === "NotDividableBy")
    .forEach((rule) => {
      values = [...values, ...rule.inputs];
    });

  values = [...new Set(values)];

  return [
    ...rules.filter((rule) => rule.constructor.name !== "NotDividableBy"),
    new NotDividableBy(...values),
  ];
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseNot = (rules, digitIsRule = false) => {
  if (rules.filter((rule) => rule.constructor.name === "Not").length <= 1)
    return rules;

  let notValues = [];
  rules
    .filter((rule) => rule.constructor.name === "Not")
    .forEach((rule) => {
      notValues = [...notValues, ...rule.inputs];
    });

  notValues = [...new Set(notValues)];

  return [
    ...rules.filter((rule) => rule.constructor.name !== "Not"),
    new Not(...notValues),
  ];
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseIs = (rules, digitIsRule = false) => {
  if (rules.filter((rule) => rule.constructor.name === "Is").length <= 1)
    return rules;

  let isValues = [];
  rules
    .filter((rule) => rule.constructor.name === "Is")
    .forEach((rule) => {
      isValues = [...isValues, ...rule.inputs];
    });

  isValues = [...new Set(isValues)];

  return [
    ...rules.filter((rule) => rule.constructor.name !== "Is"),
    new Is(...isValues),
  ];
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseIsEven = (rules, digitIsRule = false) => {
  let dividableBy = rules.find(
    (rule) => rule.constructor.name === "DividableBy"
  );

  if (dividableBy && dividableBy.inputs.indexOf(2) > -1) {
    const newDividableNumbers = dividableBy.inputs.filter(
      (number) => number !== 2
    );

    rules = [
      ...rules.filter((rule) => rule.constructor.name !== "DividableBy"),
      new IsEven(),
    ];

    if (newDividableNumbers.length > 0) {
      rules.push(new DividableBy(...newDividableNumbers));
    }
  }

  if (digitIsRule === true) {
    const isRule = rules.find(
      (rule) =>
        rule.constructor.name === "Is" &&
        arraysAreEqual([0, 2, 4, 6, 8], rule.inputs)
    );

    if (isRule) {
      rules = [...rules.filter((rule) => rule.constructor.name !== "Is")];
    }

    const notRule = rules.find(
      (rule) =>
        rule.constructor.name === "Not" &&
        arraysAreEqual([1, 3, 5, 7, 9], rule.inputs)
    );

    if (notRule) {
      rules = [...rules.filter((rule) => rule.constructor.name !== "Not")];
    }

    if (isRule || notRule) {
      rules.push(new IsEven());
    }
  }

  // Remove any duplicate IsEven that we've created
  if (rules.filter((rule) => rule.constructor.name === "IsEven").length > 0) {
    rules = [
      ...rules.filter((rule) => rule.constructor.name !== "IsEven"),
      new IsEven(),
    ];
  }

  return rules;
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseIsOdd = (rules, digitIsRule = false) => {
  let notDividableBy = rules.find(
    (rule) => rule.constructor.name === "NotDividableBy"
  );

  if (notDividableBy && notDividableBy.inputs.indexOf(2) > -1) {
    const newNotDividableNumbers = notDividableBy.inputs.filter(
      (number) => number !== 2
    );

    rules = [
      ...rules.filter((rule) => rule.constructor.name !== "NotDividableBy"),
      new IsOdd(),
    ];

    if (newNotDividableNumbers.length > 0) {
      rules.push(new NotDividableBy(...newNotDividableNumbers));
    }
  }

  if (digitIsRule === true) {
    const isRule = rules.find(
      (rule) =>
        rule.constructor.name === "Is" &&
        arraysAreEqual([1, 3, 5, 7, 9], rule.inputs)
    );

    if (isRule) {
      rules = [...rules.filter((rule) => rule.constructor.name !== "Is")];
    }

    const notRule = rules.find(
      (rule) =>
        rule.constructor.name === "Not" &&
        arraysAreEqual([0, 2, 4, 6, 8], rule.inputs)
    );

    if (notRule) {
      rules = [...rules.filter((rule) => rule.constructor.name !== "Not")];
    }

    if (isRule || notRule) {
      rules.push(new IsOdd());
    }
  }

  // Remove any duplicate IsOdds that we've created
  if (rules.filter((rule) => rule.constructor.name === "IsOdd").length > 0) {
    rules = [
      ...rules.filter((rule) => rule.constructor.name !== "IsOdd"),
      new IsOdd(),
    ];
  }

  return rules;
};

/**
 * @param {Rule[]} rules
 * @param {boolean} digitIsRule
 *
 * @returns Rule[]
 */
export const collapseDigitIs = (rules, digitIsRule = false) => {
  const digitIsRules = rules.filter(
    (rule) => rule.constructor.name === "DigitIs"
  );

  // Group the rules by their digit so that we can collapse each group at a time
  const rulesGroupedByName = digitIsRules.reduce((grouped, currentRule) => {
    if (!grouped[currentRule.digitName]) {
      grouped[currentRule.digitName] = {
        name: currentRule.digitName,
        index: currentRule.digitIndex,
        rules: [],
      };
    }

    grouped[currentRule.digitName].rules.push(currentRule.digitRule);

    return grouped;
  }, {});

  const collapsedRules = Object.values(rulesGroupedByName).map((group) => {
    return {
      ...group,
      rules: collapse(group.rules, true),
    };
  });

  // Filter out the existing DigitIs rules
  rules = rules.filter((rule) => rule.constructor.name !== "DigitIs");

  // Push in our collapsed ones
  collapsedRules.forEach((group) => {
    group.rules.forEach((rule) => {
      rules.push(new DigitIs(group.name, group.index, rule));
    });
  });

  return rules;
};

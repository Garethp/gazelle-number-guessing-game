import {
  between,
  betweenInc,
  betweenLowerInc,
  betweenUpperInc,
  dividableBy,
  even,
  greaterThan,
  greaterThanInc,
  is,
  isNotPrime,
  isPrime,
  lessThan,
  lessThanInc,
  not,
  notDividableBy,
  notRepeating,
  odd,
  repeating,
} from "./ruleFunctions.js";

export class Rule {
  /**
   * @param {function} ruleFunc
   * @param {number} inputs
   */
  constructor(ruleFunc, ...inputs) {
    this.ruleFunc = ruleFunc;
    this.inputs = inputs.map((input) =>
      parseInt(`${input}`.replaceAll(/[\s,]*/g, ""))
    );
  }

  /**
   * @param {number} number
   * @return boolean
   */
  matches(number) {
    return this.ruleFunc(...this.inputs)(number);
  }

  /**
   * @param {number} number
   * Rule
   */
  createCorrection(number) {
    if (!this.matches(number)) return this.createCorrectImpl();

    return this;
  }

  /**
   * @return Rule
   */
  createCorrectImpl() {
    throw new Exception("Not Implemented");
  }

  addNumber(number) {
    this.inputs.push(number);
  }

  toString() {
    throw new Exception("Not Implemented");
  }

  order() {
    throw new Exception("Order not found");
  }
}

export class RuleNotFound extends Rule {
  constructor(text) {
    super(() => false);
    this.text = text;
  }

  toString() {
    return `Rule not found for: ${this.text}`;
  }
}

export class GreaterThan extends Rule {
  constructor(...inputs) {
    super(greaterThan, ...inputs);
  }

  createCorrectImpl() {
    return new LessThanInc(this.inputs[0]);
  }

  toString() {
    return `x > ${this.inputs[0]}`;
  }
}

export class GreaterThanInc extends Rule {
  constructor(...inputs) {
    super(greaterThanInc, ...inputs);
  }

  createCorrectImpl() {
    return new LessThan(this.inputs[0]);
  }

  toString() {
    return `x >= ${this.inputs[0]}`;
  }

  order() {
    return 0;
  }
}

export class LessThan extends Rule {
  constructor(...inputs) {
    super(lessThan, ...inputs);
  }

  createCorrectImpl() {
    return new GreaterThanInc(this.inputs[0]);
  }

  toString() {
    return `x < ${this.inputs[0]}`;
  }

  order() {
    return 1;
  }
}

export class LessThanInc extends Rule {
  constructor(...inputs) {
    super(lessThanInc, ...inputs);
  }

  createCorrectImpl() {
    return new GreaterThan(this.inputs[0]);
  }

  toString() {
    return `x <= ${this.inputs[0]}`;
  }

  order() {
    return 2;
  }
}

export class Between extends Rule {
  constructor(...inputs) {
    super(between, ...inputs.sort());
  }

  /**
   * @param {number} number
   * Rule
   */
  createCorrection(number) {
    if (this.matches(number)) return this;

    if (number <= this.inputs[0]) return new LessThanInc(this.inputs[0]);
    if (number >= this.inputs[1]) return new GreaterThanInc(this.inputs[1]);
  }

  toString() {
    return `${this.inputs[0]} < x < ${this.inputs[1]}`;
  }

  order() {
    return 3;
  }
}

export class BetweenLowerInc extends Rule {
  constructor(...inputs) {
    super(betweenLowerInc, ...inputs.sort());
  }

  /**
   * @param {number} number
   * Rule
   */
  createCorrection(number) {
    if (this.matches(number)) return this;

    if (number < this.inputs[0]) return new LessThan(this.inputs[0]);
    if (number >= this.inputs[1]) return new GreaterThanInc(this.inputs[1]);
  }

  toString() {
    return `${this.inputs[0]} <= x < ${this.inputs[1]}`;
  }

  order() {
    return 4;
  }
}

export class BetweenUpperInc extends Rule {
  constructor(...inputs) {
    super(betweenUpperInc, ...inputs.sort());
  }

  /**
   * @param {number} number
   * Rule
   */
  createCorrection(number) {
    if (this.matches(number)) return this;

    if (number <= this.inputs[0]) return new LessThanInc(this.inputs[0]);
    if (number > this.inputs[1]) return new GreaterThan(this.inputs[1]);
  }

  toString() {
    return `${this.inputs[0]} < x =< ${this.inputs[1]}`;
  }

  order() {
    return 5;
  }
}

export class BetweenInc extends Rule {
  constructor(...inputs) {
    super(betweenInc, ...inputs.sort());
  }

  /**
   * @param {number} number
   * Rule
   */
  createCorrection(number) {
    if (this.matches(number)) return this;

    if (number < this.inputs[0]) return new LessThan(this.inputs[0]);
    if (number > this.inputs[1]) return new GreaterThan(this.inputs[1]);
  }

  toString() {
    return `${this.inputs[0]} <= x =< ${this.inputs[1]}`;
  }

  order() {
    return 6;
  }
}

export class IsOdd extends Rule {
  constructor() {
    super(odd);
  }

  createCorrectImpl() {
    return new IsEven();
  }

  toString() {
    return "Odd";
  }

  order() {
    return 7;
  }
}

export class IsEven extends Rule {
  constructor() {
    super(even);
  }

  createCorrectImpl() {
    return new IsOdd();
  }

  toString() {
    return "Even";
  }

  order() {
    return 8;
  }
}

export class DividableBy extends Rule {
  constructor(...inputs) {
    super(dividableBy, ...inputs);
  }

  matches(number) {
    return this.inputs.every((x) => dividableBy(x)(number));
  }

  createCorrectImpl() {
    return new NotDividableBy(...this.inputs);
  }
  a;

  toString() {
    return `Dividable by ${this.inputs.join(", ")}`;
  }

  order() {
    return 9;
  }
}

export class NotDividableBy extends Rule {
  constructor(...inputs) {
    super(notDividableBy, ...inputs);
  }

  matches(number) {
    return this.inputs.every((x) => notDividableBy(x)(number));
  }

  createCorrectImpl() {
    return new DividableBy(...this.inputs);
  }

  toString() {
    return `Not dividable by ${this.inputs.join(", ")}`;
  }

  order() {
    return 10;
  }
}

export class Not extends Rule {
  constructor(...inputs) {
    super(not, ...inputs);
  }

  createCorrectImpl() {
    return new Is(...this.inputs);
  }

  toString() {
    return `Not ${this.inputs.join(" or ")}`;
  }

  order() {
    return 11;
  }
}

export class Is extends Rule {
  constructor(...inputs) {
    super(is, ...inputs);
  }

  createCorrectImpl() {
    return new Not(...this.inputs);
  }

  toString() {
    return `Is ${this.inputs.join(" or ")}`;
  }

  order() {
    return 12;
  }
}

export class DigitIs extends Rule {
  /**
   * @param {string} digitName
   * @param {number} digitIndex
   * @param {Rule} digitRule
   */
  constructor(digitName, digitIndex, digitRule) {
    super(() => {});

    this.digitName = digitName;
    this.digitIndex = digitIndex;
    this.digitRule = digitRule;
  }

  matches(number) {
    if (`${number}`.length < this.digitIndex + 1) return false;

    const digit = parseInt(
      `${number}`.split("").reverse().join("")[this.digitIndex]
    );

    return this.digitRule.matches(digit);
  }

  createCorrectImpl() {
    return new DigitIs(
      this.digitName,
      this.digitIndex,
      this.digitRule.createCorrectImpl()
    );
  }

  toString() {
    const string = `${this.digitName} digit ${this.digitRule.toString()}`;
    return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;
  }

  order() {
    return 90 - this.digitIndex;
  }
}

export class IsRepeating extends Rule {
  constructor() {
    super(repeating);
  }

  createCorrectImpl() {
    return new IsNotRepeating();
  }

  order() {
    return 14;
  }
}

export class IsNotRepeating extends Rule {
  constructor() {
    super(notRepeating);
  }

  createCorrectImpl() {
    return new IsRepeating();
  }

  order() {
    return 15;
  }
}

export class IsPrime extends Rule {
  constructor() {
    super(isPrime);
  }

  createCorrectImpl() {
    return new IsNotPrime();
  }

  order() {
    return 16;
  }
}

export class IsNotPrime extends Rule {
  constructor() {
    super(isNotPrime);
  }

  createCorrectImpl() {
    return new IsPrime();
  }

  order() {
    return 17;
  }
}

export class NoOpRule extends Rule {
  constructor() {
    super(() => {});
  }

  matches(number) {
    return true;
  }

  toString() {
    return "";
  }

  order() {
    return -1;
  }
}

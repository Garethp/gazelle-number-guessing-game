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
  DigitIs,
} from "./rules.js";
import { collapse, expand } from "./collapseRules.js";

describe("Collapse GreaterThan", () => {
  it("should only return the highest GreaterThan", () => {
    const input = [new GreaterThan(5), new GreaterThan(10)];

    expect(collapse(input)).toEqual([new GreaterThan(10)]);
  });

  it("should collapse GreaterThan and GreaterThanInc", () => {
    expect(
      collapse([
        new GreaterThan(5),
        new GreaterThan(10),
        new GreaterThanInc(11),
      ])
    ).toEqual([new GreaterThanInc(11)]);
  });

  it("should prefer GreaterThan over GreaterThanInc", () => {
    expect(
      collapse([
        new GreaterThan(5),
        new GreaterThanInc(10),
        new GreaterThan(10),
      ])
    ).toEqual([new GreaterThan(10)]);
  });
});

describe("Collapse GreaterThanInc", () => {
  it("should only return the highest GreaterThanInc", () => {
    const input = [new GreaterThanInc(5), new GreaterThanInc(10)];

    expect(collapse(input)).toEqual([new GreaterThanInc(10)]);
  });
});

describe("Collapse LessThan", () => {
  it("should only return the lowest LessThanRule", () => {
    const input = [new Is(1, 2, 3), new LessThan(5), new LessThan(10)];

    expect(collapse(input)).toEqual([new Is(1, 2, 3), new LessThan(5)]);
  });

  it("should collapse LessThan and LessThanInc", () => {
    expect(
      collapse([new LessThan(5), new LessThan(10), new LessThanInc(4)])
    ).toEqual([new LessThanInc(4)]);
  });

  it("should prefer prefer LessThan over LessThanInc", () => {
    expect(
      collapse([new LessThan(5), new LessThan(10), new LessThanInc(5)])
    ).toEqual([new LessThan(5)]);
  });
});

describe("Collapse LessThanInc", () => {
  it("should only return the lowest LessThanInc", () => {
    const input = [new Is(1, 2, 3), new LessThanInc(5), new LessThanInc(10)];

    expect(collapse(input)).toEqual([new Is(1, 2, 3), new LessThanInc(5)]);
  });
});

describe("Collapse Between", () => {
  it("should collapse LessThan and GreaterThan rules", () => {
    expect(collapse([new GreaterThan(3), new LessThan(5)])).toEqual([
      new Between(3, 5),
    ]);
  });

  it("should collapse LessThanInc and GreaterThan rules", () => {
    expect(collapse([new GreaterThan(3), new LessThanInc(5)])).toEqual([
      new BetweenUpperInc(3, 5),
    ]);
  });

  it("should collapse LessThan and GreaterThanInc rules", () => {
    expect(collapse([new GreaterThanInc(3), new LessThan(5)])).toEqual([
      new BetweenLowerInc(3, 5),
    ]);
  });

  it("should collapse LessThanInc and GreaterThanInc rules", () => {
    expect(collapse([new GreaterThanInc(3), new LessThanInc(5)])).toEqual([
      new BetweenInc(3, 5),
    ]);
  });
});

describe("Collapse Is Odd", () => {
  it("should collapse complete is rules into IsOdd for DigitIs", () => {
    expect(collapse([new Is(1, 3, 5, 7, 9)], true)).toEqual([new IsOdd()]);
  });

  it("should collapse more than complete is rules into IsOdd for DigitIs", () => {
    expect(collapse([new Is(1, 2, 3, 5, 7, 9)], true)).toEqual([
      new Is(1, 2, 3, 5, 7, 9),
    ]);
  });

  it("should not collapse complete is rules into IsOdd for non-DigitIs", () => {
    expect(collapse([new Is(1, 3, 5, 7, 9)], false)).toEqual([
      new Is(1, 3, 5, 7, 9),
    ]);
  });

  it("should collapse complete not rules into IsOdd for DigitIs", () => {
    expect(collapse([new Not(0, 2, 4, 6, 8)], true)).toEqual([new IsOdd()]);
  });

  it("should collapse more than complete not rules into IsOdd for DigitIs", () => {
    expect(collapse([new Not(0, 1, 2, 4, 6, 8)], true)).toEqual([
      new Not(1),
      new IsOdd(),
    ]);
  });

  it("should not collapse complete not rules into IsOdd for non-DigitIs", () => {
    expect(collapse([new Not(0, 2, 4, 6, 8)], false)).toEqual([
      new Not(0, 2, 4, 6, 8),
    ]);
  });

  it("should collapse NotDividableBy rules into IsOdd", () => {
    expect(collapse([new NotDividableBy(2)])).toEqual([new IsOdd()]);
    expect(collapse([new NotDividableBy(2)], true)).toEqual([new IsOdd()]);
  });

  it("should collapse IsOdd, Is and Not rules together for DigitIs", () => {
    expect(collapse([new IsOdd(), new Is(3, 5), new Not(2, 4)], true)).toEqual([
      new IsOdd(),
    ]);
  });
});

describe("Collapse Is Even", () => {
  it("should collapse complete is rules into IsEven for DigitIs", () => {
    expect(collapse([new Is(0, 2, 4, 6, 8)], true)).toEqual([new IsEven()]);
  });

  it("should not collapse more than complete is rules into IsEven for DigitIs", () => {
    expect(collapse([new Is(0, 1, 2, 4, 6, 8)], true)).toEqual([
      new Is(0, 1, 2, 4, 6, 8),
    ]);
  });

  it("should not collapse complete is rules into IsEven for non-DigitIs", () => {
    expect(collapse([new Is(0, 2, 4, 6, 8)], false)).toEqual([
      new Is(0, 2, 4, 6, 8),
    ]);
  });

  it("should collapse complete is not rules into IsEven for DigitIs", () => {
    expect(collapse([new Not(1, 3, 5, 7, 9)], true)).toEqual([new IsEven()]);
  });

  it("should collapse more than complete is not rules into IsEven for DigitIs", () => {
    expect(collapse([new Not(1, 2, 3, 5, 7, 9)], true)).toEqual([
      new Not(2),
      new IsEven(),
    ]);
  });

  it("should not collapse complete is not rules into IsEven for non-DigitIs", () => {
    expect(collapse([new Not(1, 3, 5, 7, 9)], false)).toEqual([
      new Not(1, 3, 5, 7, 9),
    ]);
  });

  it("should collapse complete DividableBy rules into IsEven", () => {
    expect(collapse([new DividableBy(2)])).toEqual([new IsEven()]);
    expect(collapse([new DividableBy(2)], true)).toEqual([new IsEven()]);
  });

  it("should collapse IsEven, Is and Not rules together for DigitIs", () => {
    expect(collapse([new IsEven(), new Is(2, 4), new Not(1, 3)], true)).toEqual(
      [new IsEven()]
    );
  });
});

describe("Collapse DividableBy", () => {
  it("should collapse multiple DividableBy", () => {
    expect(
      collapse([
        new DividableBy(4),
        new DividableBy(4),
        new DividableBy(5),
        new DividableBy(6, 7),
      ])
    ).toEqual([new DividableBy(4, 5, 6, 7)]);
  });
});

describe("Collapse NotDividableBy", () => {
  it("should collapse multiple NotDividableBy", () => {
    expect(
      collapse([
        new NotDividableBy(4),
        new NotDividableBy(4),
        new NotDividableBy(5),
        new NotDividableBy(6, 7),
      ])
    ).toEqual([new NotDividableBy(4, 5, 6, 7)]);
  });
});

describe("Collapse Not", () => {
  it("should collapse multiple Not", () => {
    expect(
      collapse([new Not(1), new Not(1, 2), new Not(3, 5), new Not(9)])
    ).toEqual([new Not(1, 2, 3, 5, 9)]);
  });
});

describe("Collapse Is", () => {
  it("should collapse multiple Is", () => {
    expect(
      collapse([new Is(1), new Is(1, 2), new Is(3, 5), new Is(9)])
    ).toEqual([new Is(1, 2, 3, 5, 9)]);
  });

  it("should collapse to the most restrictive Is", () => {
    expect(collapse([new Is(1, 3, 4), new Is(3, 4)])).toEqual(new Is(3, 4));
  });
});

describe("Collapse DigitIs", () => {
  it("should collapse multiple DigitIs", () => {
    expect(
      collapse([
        new DigitIs("hundreds", 3, new Is(1)),
        new DigitIs("hundreds", 3, new Is(2)),
        new DigitIs("thousands", 4, new Is(2)),
      ])
    ).toBe([
      new DigitIs("hundreds", 3, new Is(1, 2)),
      new DigitIs("thousands", 4, new Is(2)),
    ]);
  });
});

describe("Expand", () => {
  it("should expand IsEven", () => {
    expect(expand([new IsEven()])).toEqual([new DividableBy(2)]);
  });

  it("should expand IsEven for DigitIs", () => {
    expect(expand([new IsEven()], true)).toEqual([
      new DividableBy(2),
      new Is(0, 2, 4, 6, 8),
      new Not(1, 3, 5, 7, 9),
    ]);
  });

  it("should expand IsOdd", () => {
    expect(expand([new IsOdd()])).toEqual([new NotDividableBy(2)]);
  });

  it("should expand IsOdd for DigitIs", () => {
    expect(expand([new IsOdd()], true)).toEqual([
      new NotDividableBy(2),
      new Is(1, 3, 5, 7, 9),
      new Not(0, 2, 4, 6, 8),
    ]);
  });

  it("should expand Between", () => {
    expect(expand([new Between(1, 3)])).toEqual([
      new GreaterThan(1),
      new LessThan(3),
    ]);
  });

  it("should expand BetweenLowerInc", () => {
    expect(expand([new BetweenLowerInc(1, 3)])).toEqual([
      new GreaterThanInc(1),
      new LessThan(3),
    ]);
  });

  it("should expand BetweenUpperInc", () => {
    expect(expand([new BetweenUpperInc(1, 3)])).toEqual([
      new GreaterThan(1),
      new LessThanInc(3),
    ]);
  });

  it("should expand BetweenInc", () => {
    expect(expand([new BetweenInc(1, 3)])).toEqual([
      new GreaterThanInc(1),
      new LessThanInc(3),
    ]);
  });
});

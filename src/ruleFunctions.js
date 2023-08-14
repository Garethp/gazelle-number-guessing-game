export const greaterThan = (a) => (x) => x > a;
export const greaterThanInc = (a) => (x) => x >= a;
export const lessThan = (a) => (x) => x < a;
export const lessThanInc = (a) => (x) => x <= a;

export const between = (a, b) => (x) => a < x && x < b;
export const betweenLowerInc = (a, b) => (x) => a <= x && x < b;
export const betweenUpperInc = (a, b) => (x) => a < x && x <= b;
export const betweenInc = (a, b) => (x) => a <= x && x <= b;

export const even = () => (x) => x % 2 === 0;
export const odd = () => (x) => x % 2 !== 0;

export const dividableBy = (a) => (x) => x % a === 0;
export const notDividableBy = (a) => (x) => x % a !== 0;

export const not =
  (...a) =>
  (x) =>
    a.indexOf(x) === -1;

export const is =
  (...a) =>
  (x) =>
    a.indexOf(x) !== -1;

export const repeating = () => (x) => /(.).*\1/.test(`${x}`);
export const notRepeating = () => (x) => !/(.).*\1/.test(`${x}`);

export const isPrime = () => (x) => {
  if (x <= 1) return false;
  if (x <= 3) return true;

  if (x % 2 === 0 || x % 3 === 0) return false;

  let i = 5;
  while (i * i <= x) {
    if (x % i === 0 || x % (i + 2) === 0) return false;
    i += 6;
  }

  return true;
};
export const isNotPrime = () => (x) => !isPrime(x);

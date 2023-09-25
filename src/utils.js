/**
 * Checks whether two arrays have equal values. This check will only consider unique values and does not care about
 * array order
 *
 * @param {Array} a
 * @param {Array} b
 *
 * @returns {boolean}
 */
export const arraysAreEqual = (a, b) => {
  a = [...new Set(a)];
  b = [...new Set(b)];

  if (a.length !== b.length) return false;

  return a.every((item) => b.indexOf(item) !== -1);
};

/**
 * Checks whether all items in itemsToLook for are present in arrayToCheck
 *
 * @param {Array} arrayToCheck
 * @param {Array} itemsToLookFor
 *
 * @return {boolean}
 */
export const arrayContains = (arrayToCheck, itemsToLookFor) => {
  return itemsToLookFor.every((item) => arrayToCheck.indexOf(item) > -1);
};

/* eslint-disable no-nested-ternary */
/**
 * Sort the array of objects based on the property value
 * @param {Object} data Array of objects
 * @param {String} key The property on which to be sorted
 * @param {String} sortOrder Sort Order, either Ascending or
 *        Descending Order (By default it is ascending Order)
 */

export enum SortOrder {
  Ascending = 'ascending',
  Descending = 'descending',
}

export enum SortType {
  String = 'string',
  Number = 'number',
}

type GetKey<T> = (item: T) => string | number | boolean;

export const sort = <T>(
  data: T[],
  getKey: GetKey<T>,
  sortOrder: SortOrder = SortOrder.Ascending,
  sortType: SortType = SortType.String,
): T[] => {
  const orderOfSort = sortOrder === SortOrder.Ascending
    ? 1
    : sortOrder === SortOrder.Descending
      ? -1
      : 1;

  return [...data].sort((a: T, b: T) => {
    const x = sortType === SortType.String ? (getKey(a) || '').toString().toLowerCase().trim() : +(getKey(a));
    const y = sortType === SortType.String ? (getKey(b) || '').toString().toLowerCase().trim() : +(getKey(b));

    const result = x < y ? -1 : x > y ? 1 : 0;

    return result * orderOfSort;
  });
};

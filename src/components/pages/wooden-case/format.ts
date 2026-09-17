export const formatGold = (value: number, precision = 3): string =>
  `${value.toFixed(precision)} g`;

export const formatPercent = (ratio: number, precision = 2): string =>
  `${(ratio * 100).toFixed(precision)}%`;

export const formatQuantity = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

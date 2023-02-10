import { FilterFn } from '@tanstack/table-core';

declare module '@tanstack/table-core' {
  interface FilterFns {
    multipleBand: FilterFn<unknown>;
  }
}

export interface NumericFilterBand {
  lower?: number;
  upper?: number;
  strictUpper: boolean;
  strictLower: boolean;
}

export interface NumericFilterMask {
  bands: NumericFilterBand[];
}

export const multipleBandFilter: FilterFn<any> = (row, columnId, filterMask: NumericFilterMask) => {
  let passed = true;
  const cellValue: number = row.getValue(columnId);

  if (!filterMask.bands) {
    return true;
  }
  filterMask.bands.every(band => {
    passed = true;
    if (band.lower !== undefined) {
      passed = band.strictLower
        ? band.lower < cellValue
        : band.lower <= cellValue;
    }

    if (passed && (band.upper !== undefined)) {
      passed = band.strictUpper
        ? band.upper > cellValue
        : band.upper >= cellValue;
    }

    return !passed;
  });

  return passed;
};

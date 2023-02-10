import { describe, expect, test } from 'vitest';
import { multipleBandFilter, NumericFilterMask } from './customFilters';

describe('customFilters', () => {
  describe('multipleBandFilter', () => {
    test.each([
      [-1, false],
      [0, true],
      [1, true],
      [999, true],
      [1000, true],
      [1001, false],
    ])('when strict boundaries not set, includes edge value %i correctly', (value, included) => {
      const numericFilterMask: NumericFilterMask = {
        bands: [{
          lower: 0,
          upper: 1_000,
          strictLower: false,
          strictUpper: false,
        }],
      };

      const passedFilter = multipleBandFilter({ getValue: () => value } as any, '', numericFilterMask, () => {
      });

      expect(passedFilter, `Testing ${value} did not result in included: ${included}`).toBe(included);
    });

    test.each([
      [-1, false],
      [0, false],
      [1, true],
      [999, true],
      [1000, false],
      [1001, false],
    ])('when strict boundaries set, includes edge value %i correctly', (value, included) => {
      const numericFilterMask: NumericFilterMask = {
        bands: [{
          lower: 0,
          upper: 1_000,
          strictLower: true,
          strictUpper: true,
        }],
      };

      const passedFilter = multipleBandFilter({ getValue: () => value } as any, '', numericFilterMask, () => {
      });

      expect(passedFilter, `Testing ${value} did not result in included: ${included}`).toBe(included);
    });

    test.each([
      [-1, false],
      [0, false],
      [1, true],
      [299, true],
      [300, true],
      [301, true],
      [499, true],
      [500, false],
      [501, false],
    ])('when strict boundaries not set and multiple bands defined, includes edge value %i correctly ', (value, included) => {
      const numericFilterMask: NumericFilterMask = {
        bands: [
          {
            lower: 0,
            upper: 300,
            strictLower: true,
            strictUpper: false,
          },
          {
            lower: 300,
            upper: 500,
            strictLower: false,
            strictUpper: true,
          },
        ],
      };

      const passedFilter = multipleBandFilter({ getValue: () => value } as any, '', numericFilterMask, () => {
      });

      expect(passedFilter, `Testing ${value} did not result in included: ${included}`).toBe(included);
    });

    test.each([
      [-1, false],
      [0, false],
      [1, true],
      [299, true],
      [300, false],
      [301, true],
      [499, true],
      [500, false],
      [501, false],
    ])('when strict boundaries set and multiple bands defined, includes edge value %i correctly', (value, included) => {
      const numericFilterMask: NumericFilterMask = {
        bands: [
          {
            lower: 0,
            upper: 300,
            strictLower: true,
            strictUpper: true,
          },
          {
            lower: 300,
            upper: 500,
            strictLower: true,
            strictUpper: true,
          },
        ],
      };

      const passedFilter = multipleBandFilter({ getValue: () => value } as any, '', numericFilterMask, () => {
      });

      expect(passedFilter, `Testing ${value} did not result in included: ${included}`).toBe(included);
    });
  });
});

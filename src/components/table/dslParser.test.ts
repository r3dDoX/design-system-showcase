import { describe, expect, it } from 'vitest';
import { parseDSL } from './dslParser';
import { NumericFilterMask } from './customFilters';

describe('dslParser', () => {
  it('parses single expression with strict boundaries to numeric filter mask', () => {
    const numericFilterMask = parseDSL('<9');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [{
        upper: 9,
        strictLower: true,
        strictUpper: true,
      }],
    });
  });

  it('parses single expression without strict boundaries to numeric filter mask', () => {
    const numericFilterMask = parseDSL('>=0');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [{
        lower: 0,
        strictLower: false,
        strictUpper: true,
      }],
    });
  });

  it('parses multiple expression with and', () => {
    const numericFilterMask = parseDSL('>=0,<9');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [{
        lower: 0,
        upper: 9,
        strictLower: false,
        strictUpper: true,
      }],
    });
  });

  it('parses multiple expression with or', () => {
    const numericFilterMask = parseDSL('>=0;<9');

    expect(numericFilterMask).toEqual<NumericFilterMask>({
      bands: [
        {
          lower: 0,
          strictLower: false,
          strictUpper: true,
        },
        {
          upper: 9,
          strictLower: true,
          strictUpper: true,
        },
      ],
    });
  });

  it('throws error when invalid syntax', () => {
    expect(() => parseDSL('<')).toThrowError('Invalid input');
  });
});

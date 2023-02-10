import { NumericFilterMask } from './customFilters';

const AND_OPERATOR = ',';
const OR_OPERATOR = ';';

const numeric = /[-+]?\d+(\.\d+)?/g;
const greaterThan = />/; //1
const greaterOrEqual = />=/; //2
const lessThan = /</; //3
const lessOrEqual = /<=/; //4

function parseSingleIntervalExpression(exp: string) {
  let min = Number.NEGATIVE_INFINITY;
  let max = Number.POSITIVE_INFINITY;
  let strictLower = true;
  let strictUpper = true;

  exp.split(AND_OPERATOR).forEach(member => {
    const [operatorCode, operator] = greaterOrEqual.test(member)
      ? [2, '>=']
      : greaterThan.test(member)
        ? [1, '>']
        : lessOrEqual.test(member)
          ? [4, '<=']
          : lessThan.test(member)
            ? [3, '<']
            : [-1, ''];

    const matchedOperand = member.match(numeric);
    if (operator && matchedOperand) {
      const operand = matchedOperand[0];
      const operatorPosition = member.search(operator);
      const operandPosition = member.search(operand[0] || '');
      const operandToNumeric = parseFloat(operand);

      switch (operatorCode) {
        case -1:
          throw new Error('Invalid input');
        case 1:
          if (operandPosition < operatorPosition) {
            max = (operandToNumeric < max ? operandToNumeric : max);
          } else {
            min = (operandToNumeric > min ? operandToNumeric : min);
          }
          break;
        case 2:
          if (operandPosition < operatorPosition) {
            max = operandToNumeric < max ? operandToNumeric : max;
          } else {
            min = operandToNumeric > min ? operandToNumeric : min;
          }
          strictLower = false;
          break;
        case 3:
          if (operandPosition < operatorPosition) {
            min = (operandToNumeric > min ? operandToNumeric : min);
          } else {
            max = (operandToNumeric < max ? operandToNumeric : max);
          }
          break;
        case 4:
          if (operandPosition < operatorPosition) {
            min = operandToNumeric > min ? operandToNumeric : min;
          } else {
            max = operandToNumeric < max ? operandToNumeric : max;
          }
          strictUpper = false;
          break;
      }
    } else {
      throw new Error('Invalid input');
    }
  });

  return {
    lower: min !== Number.NEGATIVE_INFINITY ? min : undefined,
    upper: max !== Number.POSITIVE_INFINITY ? max : undefined,
    strictLower: strictLower,
    strictUpper: strictUpper,
  };
}

const emptyFilterMask: NumericFilterMask = {
  bands: [{
    lower: undefined,
    upper: undefined,
    strictLower: true,
    strictUpper: true,
  }],
};

export function parseDSL(exp: string) {
  if (exp === undefined || exp.trim() === '') {
    return emptyFilterMask;
  }

  return {
    bands: exp
      .split(OR_OPERATOR)
      .map(parseSingleIntervalExpression),
  };
}

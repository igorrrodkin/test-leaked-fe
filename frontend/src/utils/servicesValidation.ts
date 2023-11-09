/* eslint-disable max-len */
import { CheckboxInput, DropdownInput, TextInput } from '@/store/reducers/order';

import isNumber from '@/utils/isNumber';

interface Rules {
  minLength: number,
  maxLength: number,
  validateFunc: Function,
}

export interface ExtendedTextInputs extends TextInput {
  value: string,
  isError: boolean,
  errorMessage: string,
  descriptionPrefix?: string
}

export interface ExtendedDropdownInputs extends DropdownInput {
  value: number | undefined,
  isError: boolean,
  errorMessage: string,
}

export interface ExtendedCheckboxInputs extends CheckboxInput {
  value: boolean,
  isError: boolean,
  errorMessage: string
}

export type ExtendedCommonInputTypes = ExtendedTextInputs | ExtendedDropdownInputs | ExtendedCheckboxInputs;

type TValidationRules = {
  [p in string]: {
    [n in string]: Rules
  }
};

const onlyAlphabetic = /[a-zA-Z]/g;
export const onlyDigits = /[0-9]/g;
const onlyNonZeroDigits = /[1-9]/g;

export const validateCommonInputs = (
  inputs: ExtendedCommonInputTypes[],
  productId: string,
): ExtendedCommonInputTypes[] => (
  inputs.map((el: ExtendedCommonInputTypes) => {
    if (el.type === 'text' || el.type === 'textarea') {
      const isError = servicesValidation(el.value, productId, el.label, el.isRequired);

      return {
        ...el,
        isError: !!isError,
        errorMessage: isError,
      };
    }

    if (el.type === 'dropdown') {
      const isError = isNumber(el.value) ? '' : 'Field is required';

      return {
        ...el,
        isError: !!isError,
        errorMessage: isError,
      };
    }

    return el;
  })
);

const isNameWithWildcard = (value: string) => {
  if (value.includes('%')) {
    const testValue = value.replaceAll('%', '');

    if (testValue.length < 3) {
      return 'Surname/Company must have at least 3 characters before wildcard.';
    }
  }

  const trimmed = value
    .replaceAll('\'', '')
    .replaceAll('-', '')
    .replaceAll('%', '')
    .replaceAll(onlyAlphabetic, '')
    .trim();

  return !(!trimmed.length && /[a-zA-Z]/.test(value))
    ? 'Invalid Characters on browsing'
    : '';
};

const isName = (value: string) => {
  const trimmed = value
    .replaceAll('\'', '')
    .replaceAll('-', '')
    .replaceAll(onlyAlphabetic, '')
    .trim();

  return !(!trimmed.length && /[a-zA-Z]/.test(value))
    ? 'Invalid Characters on browsing'
    : '';
};

const isCompany = (value: string) => {
  if (value.includes('%')) {
    const testValue = value.replaceAll('%', '');

    if (testValue.length < 3) {
      return 'Surname/Company must have at least 3 characters before wildcard.';
    }
  }

  return '';
};

const NSWPlanNumberCPDP = (value: string) => {
  const isValid = /^[DS]P\d+$/.test(value);

  return isValid
    ? ''
    : 'Invalid format';
};

const alwaysValid = () => '';

const validationRules: TValidationRules = {
  // ALL
  RPTNATOWN: {
    'First Name': {
      minLength: 1,
      maxLength: 50,
      validateFunc: isName,
    },
    'Other Name': {
      minLength: 1,
      maxLength: 50,
      validateFunc: isName,
    },
    'Last Name': {
      minLength: 1,
      maxLength: 50,
      validateFunc: isName,
    },
    'Organisation Name': {
      minLength: 1,
      maxLength: 120,
      validateFunc: isName,
    },
  },
  // NSW
  'INT-NSWTRS': {
    'Title Reference': {
      minLength: 1,
      maxLength: 30,
      validateFunc: (value: string) => {
        if (value.split('/').filter((el) => el === '').length) return 'Title reference is not valid';

        // x = Any char of alphabet
        // 0 = Accepts 0-9
        // 1 = Accepts 1-9

        // x/2 || 0/2 || 1/1 || 4/6 || 3/5 || 5/5 || 7/5 || 8/4 || 8/5 || 9/4
        if (value.length === 3 && value[1] === '/' && value.split('/').length === 2) {
          const [left, right] = value.split('/');
          const isError = (/^[a-zA-Z]+$/.test(left) && right === '2')
            || (/^[0-9]+$/.test(left) && right === '2')
            || (/^[1-9]+$/.test(left) && /^[1-9]+$/.test(right))
            || (left === '4' && right === '6')
            || (left === '3' && right === '5')
            || (left === '5' && right === '5')
            || (left === '7' && right === '5')
            || (left === '8' && right === '4')
            || (left === '8' && right === '5')
            || (left === '9' && right === '4');

          return isError ? 'Invalid plan number' : '';
        }

        // xxxx
        if (value.length === 4 && /^[a-zA-Z]+$/.test(value)) {
          return 'Invalid plan number';
        }

        // 1/DP1 || 1/CP1 || 1/SP5 || 1/SP8 || 4/SP1
        if (value.length === 5 && value[1] === '/' && value.split('/').length === 2) {
          const [left, right] = value.split('/');
          const isError = (/^[1-9]+$/.test(left) && right.includes('DP') && /^[1-9]+$/.test(right[2]))
            || (/^[1-9]+$/.test(left) && right.includes('CP') && /^[1-9]+$/.test(right[2]))
            || (/^[1-9]+$/.test(left) && right === 'SP5')
            || (/^[1-9]+$/.test(left) && right === 'SP8')
            || (left === '4' && right.includes('SP') && /^[1-9]+$/.test(right[2]));

          return isError ? 'Invalid plan number' : '';
        }

        // 0/x/2 || 0/0/2
        if (value.length === 5 && value[1] === '/' && value[3] === '/' && value.split('/').length === 3) {
          const [left, middle, right] = value.split('/');

          const isError = (/^[0-9]+$/.test(left) && /^[a-zA-Z]+$/.test(middle) && right === '2')
            || (/^[0-9]+$/.test(left) && /^[0-9]+$/.test(middle) && right === '2');

          return isError ? 'Invalid plan number' : '';
        }

        // xxxx123
        if (value.length === 7 && /^[a-zA-Z]+$/.test(value.substring(0, 4)) && value.slice(4) === '123') {
          return 'Invalid plan number';
        }

        // xxxx@123
        if (value.length === 8 && value[4] === '@' && value.split('@').length === 2) {
          const [left, right] = value.split('@');
          const isError = (/^[a-zA-Z]+$/.test(left) && right === '123');

          return isError ? 'Title reference is not valid' : '';
        }

        // 1111/DP1 || 1111/CP1
        if (value.length === 8 && value[4] === '/' && value.split('/').length === 2) {
          const [left, right] = value.split('/');

          const isError = (/^[1-9]+$/.test(left) && right.includes('DP') && /^[1-9]+$/.test(right[2]))
            || (/^[1-9]+$/.test(left) && right.includes('CP') && /^[1-9]+$/.test(right[2]));

          return isError ? 'Invalid plan number' : '';
        }

        // ACAA/1000001 || 1111/0111111 || 1111/1000000
        if (value.length === 12 && value[4] === '/' && value.split('/').length === 2) {
          const [left, right] = value.split('/');

          const isError = (left === 'ACAA' && /^[1-9]+$/.test(right[0]) && /^[0-9]+$/.test(right.substring(1, 6)) && /^[1-9]+$/.test(right[6]))
            || (/^[1-9]+$/.test(left) && /^[0-9]+$/.test(right[0]) && /^[1-9]+$/.test(right.slice(1)))
            || (/^[1-9]+$/.test(left) && /^[1-9]+$/.test(right[0]) && /^[0-9]+$/.test(right.slice(1)));

          return isError ? 'Invalid plan number' : '';
        }

        // 1111/DP100001 || 1111/CP100001
        if (value.length === 13 && value[4] === '/' && value.split('/').length === 2) {
          const [left, right] = value.split('/');

          const isError = (/^[1-9]+$/.test(left) && right.includes('DP') && /^[1-9]+$/.test(right[2]) && /^[0-9]+$/.test(right.substring(3, 7)) && /^[1-9]+$/.test(right[7]))
            || (/^[1-9]+$/.test(left) && right.includes('CP') && /^[1-9]+$/.test(right[2]) && /^[0-9]+$/.test(right.substring(3, 7)) && /^[1-9]+$/.test(right[7]));

          return isError ? 'Invalid plan number' : '';
        }

        // 0000/1000/0000000 || 0000/1000/0000001 || 1000/0000/0000000 || 0100/0100/0000001 || 0010/0010/0000001 || 0001/0001/0000001
        if (value.length === 17 && value[4] === '/' && value[9] === '/' && value.split('/').length === 3) {
          const [left, middle, right] = value.split('/');

          const isError = (/^[0-9]+$/.test(left) && /^[1-9]+$/.test(middle[0]) && /^[0-9]+$/.test(middle.slice(1)) && /^[0-9]+$/.test(right))
            || (/^[0-9]+$/.test(left) && /^[1-9]+$/.test(middle[0]) && /^[0-9]+$/.test(middle.slice(1))
                && /^[0-9]+$/.test(right.substring(0, 6)) && /^[1-9]+$/.test(right[6]))
            || (/^[1-9]+$/.test(left[0]) && /^[0-9]+$/.test(left.slice(1)) && /^[0-9]+$/.test(middle)
                && /^[0-9]+$/.test(right))
            || (/^[0-9]+$/.test(left[0]) && /^[1-9]+$/.test(left[1]) && /^[0-9]+$/.test(left.slice(2))
                && /^[0-9]+$/.test(middle[0]) && /^[1-9]+$/.test(middle[1]) && /^[0-9]+$/.test(middle.slice(2))
                && /^[0-9]+$/.test(right.substring(0, 6)) && /^[1-9]+$/.test(right[6]))
            || (/^[0-9]+$/.test(left.substring(0, 2)) && /^[1-9]+$/.test(left[2]) && /^[0-9]+$/.test(left.slice(3))
                && /^[0-9]+$/.test(middle.substring(0, 2)) && /^[1-9]+$/.test(middle[2]) && /^[0-9]+$/.test(middle.slice(3))
                && /^[0-9]+$/.test(right.substring(0, 6)) && /^[1-9]+$/.test(right[6]))
            || (/^[0-9]+$/.test(left.substring(0, 3)) && /^[1-9]+$/.test(left[3])
                && /^[0-9]+$/.test(middle.substring(0, 3)) && /^[1-9]+$/.test(middle[3])
                && /^[0-9]+$/.test(right.substring(0, 6)) && /^[1-9]+$/.test(right[6]));

          return isError ? 'Invalid plan number' : '';
        }

        // 0000/1000001;
        // if (value.length === 12 && value[4] === '/' && !/SP|DP|CP/g.test(value)) {
        //   const [left, right] = value.split('/');

        //   if (right[0] === '0' || right[right.length - 1] === '0') return 'Title reference is not valid';

        //   const isValid = !left.replace(onlyDigits, '').length
        //     && !right.replace(onlyDigits, '').length;

        //   return isValid
        //     ? ''
        //     : 'Title reference is not valid';
        // }

        // x/1;
        // if (value.length === 3 && value[1] === '/') {
        //   const [left, right] = value.split('/');

        //   const isValid = !left.replace(onlyAlphabetic, '').length
        //     && !right.replace(onlyNonZeroDigits, '').length;

        //   return isValid
        //     ? ''
        //     : 'Title reference is not valid';
        // }

        // xxx/10001;
        // if (value.length === 9 && value[3] === '/' && !/SP|DP|CP/g.test(value)) {
        //   const [left, right] = value.split('/');

        //   if (right[0] === '0' || right[right.length - 1] === '0') return 'Title reference is not valid';

        //   const isValid = !left.replace(onlyAlphabetic, '').length
        //     && !right.replace(onlyDigits, '').length;

        //   return isValid
        //     ? ''
        //     : 'Title reference is not valid';
        // }

        // 1/SP1;
        /* if (value.length === 5 && value[1] === '/' && value.split('/').length === 2) {
          const [left, right] = value.split('/');

          const validatedRight = right.replace(/SP|DP|CP/gi, '')
            .replace(onlyNonZeroDigits, '');

          const isValid = !left.replace(onlyNonZeroDigits, '').length
            && !validatedRight.length;

          return isValid
            ? ''
            : 'Title reference is not valid';
        } */

        // 1111/SP1;
        /* if (value.length === 8 && value[4] === '/') {
          const [left, right] = value.split('/');

          const validatedRight = right.replace(/SP|DP|CP/g, '')
            .replace(onlyNonZeroDigits, '');

          const isValid = !left.replace(onlyNonZeroDigits, '').length
            && !validatedRight.length;

          return isValid
            ? ''
            : 'Title reference is not valid';
        } */

        // 1111/SP100001;
        /* if (value.length === 13 && value[4] === '/') {
          const [left, right] = value.split('/');

          if (right[2] === '0' || right[right.length - 1] === '0') return 'Title reference is not valid';

          const validatedRight = right.replace(/SP|DP|CP/g, '')
            .replace(onlyDigits, '');

          const isValid = !left.replace(onlyNonZeroDigits, '').length
            && !validatedRight.length;

          return isValid
            ? ''
            : 'Title reference is not valid';
        } */

        // 0/x/1    0/0/1    0000/xxxx/1000001    0000/0000/1000001 etc...
        // if (value.split('/').length === 3) {
        //   const [left, middle, right] = value.split('/');

        //   const validatedMiddle = middle.replace(onlyAlphabetic, '')
        //     .replace(onlyDigits, '');

        //   let validatedRight = '';

        //   if (right.length === 1) {
        //     validatedRight = right.replace(onlyNonZeroDigits, '');

        //     if (validatedRight.length) return 'Title reference is not valid';
        //   }

        //   if (right[0] === '0' && right[right.length - 1] === '0') return 'Title reference is not valid';

        //   validatedRight = right.replace(onlyDigits, '');

        //   const isValid = !left.replace(onlyDigits, '').length
        //     && !validatedMiddle.length
        //     && !validatedRight.length;

        //   return isValid
        //     ? ''
        //     : 'Title reference is not valid';
        // }

        const splitValue = value.split('/');

        if (splitValue.length !== 2) return 'Title reference is not valid';

        // const validatedLeft = /^\d{1,4}$/g.test(splitValue[0]);
        // const validatedRight = /^(SP|DP|CP)\d{1,6}$/gi.test(splitValue[1]);
        // const isValid = validatedLeft && validatedRight;

        // return isValid ? '' : 'Title reference is not valid';
      },
    },
  },
  LPISA: {
    'Street Number': {
      minLength: 1,
      maxLength: 10,
      validateFunc: alwaysValid,
    },
    'Street Name': {
      minLength: 1,
      maxLength: 30,
      validateFunc: alwaysValid,
    },
    Suburb: {
      minLength: 1,
      maxLength: 30,
      validateFunc: alwaysValid,
    },
  },
  LPIEP: {
    'Plan Number': {
      minLength: 1,
      maxLength: 100,
      validateFunc: (value: string) => {
        if (/^CP/.test(value)) {
          const isValid = /^CP\d+-\d+$/.test(value);

          return isValid
            ? ''
            : 'Plan number is not valid for this product';
        }

        const isValid = /^[DS]P\d+$/.test(value);

        return isValid
          ? ''
          : 'Plan number is not valid for this product';
      },
    },
  },
  LPIE88B: {
    'Plan Number': {
      minLength: 1,
      maxLength: 100,
      validateFunc: NSWPlanNumberCPDP,
    },
  },
  LPIOP: {
    'First Name': {
      minLength: 1,
      maxLength: 100,
      validateFunc: isName,
    },
    'Last Name': {
      minLength: 1,
      maxLength: 100,
      validateFunc: isName,
    },
    'Company Name': {
      minLength: 1,
      maxLength: 100,
      validateFunc: alwaysValid,
    },
  },
  LPIPLANINQ: {
    'Plan Number': {
      minLength: 1,
      maxLength: 100,
      validateFunc: NSWPlanNumberCPDP,
    },
  },
  RL: {
    'Plan Number': {
      minLength: 1,
      maxLength: 100,
      validateFunc: NSWPlanNumberCPDP,
    },
  },
  // WA
  'INT-WATRS': {
    'Title Reference': {
      minLength: 1,
      maxLength: 30,
      validateFunc: (value: string) => {
        let split = value.split('/');

        if (split.length === 1) {
          split = value.split('-');
        }

        if (split.length === 1) return 'Title reference is not valid';

        const isValid = split.some((el) => {
          const validatedValue = el.replace(onlyAlphabetic, '')
            .replace(onlyDigits, '');

          return !validatedValue.length;
        });

        return isValid
          ? ''
          : 'Title reference is not valid';
      },
    },
  },
  WASTRADR: {
    'Street Number': {
      minLength: 1,
      maxLength: 10,
      validateFunc: alwaysValid,
    },
    'Street Name': {
      minLength: 1,
      maxLength: 30,
      validateFunc: alwaysValid,
    },
    Suburb: {
      minLength: 1,
      maxLength: 30,
      validateFunc: alwaysValid,
    },
  },
  WAON: {
    'First Name': {
      minLength: 1,
      maxLength: 100,
      validateFunc: isName,
    },
    'Last Name': {
      minLength: 2,
      maxLength: 100,
      validateFunc: isName,
    },
    'Company Name': {
      minLength: 3,
      maxLength: 150,
      validateFunc: alwaysValid,
    },
  },
  WAPLANL: {
    Number: {
      minLength: 1,
      maxLength: 100,
      validateFunc: (value: string) => {
        const isValid = /^[DPS]\d+$/g.test(value);

        return isValid
          ? ''
          : 'Plan number is not valid';
      },
    },
  },
  // QLD
  'INT-QLDTRS': {
    'Title Reference': {
      minLength: 1,
      maxLength: 100,
      validateFunc: (value: string) => {
        const isValid = !value.replace(onlyDigits, '').length;

        return isValid
          ? ''
          : 'This reference is not valid';
      },
    },
  },
  'INT-QLDSTRADR': {
    'Street Number': {
      minLength: 1,
      maxLength: 10,
      validateFunc: alwaysValid,
    },
    'Street Name': {
      minLength: 1,
      maxLength: 30,
      validateFunc: alwaysValid,
    },
    Suburb: {
      minLength: 1,
      maxLength: 30,
      validateFunc: alwaysValid,
    },
  },
  DNRQLP: {
    'Lot/Plan Number': {
      minLength: 1,
      maxLength: 100,
      validateFunc: (value: string) => {
        const isWithSlash = /^\d+\/[a-zA-Z]{1,4}\d+$/g.test(value);

        if (!isWithSlash) {
          const split = value.split(/[a-zA-Z]{1,4}/);

          if (split.length === 2) {
            const [left, right] = split;

            if (!left.length) return 'Lot is required';

            const validatedLeft = left.replace(onlyDigits, '').length;
            const validatedRight = right.replace(onlyDigits, '').length;

            const isValid = !validatedLeft && !validatedRight;

            return isValid
              ? ''
              : 'Lot/Plan is not valid';
          }

          return 'Lot/Plan is not valid';
        }

        const split = value.split('/');

        if (split.length === 2) {
          const [left, right] = split;

          if (!left.length) return 'Lot is required';

          const validatedLeft = left.replace(onlyDigits, '').length;
          const validatedRight = /^[a-zA-Z]{1,4}\d+$/.test(right);

          if (!validatedRight) return `Not a valid Plan No '${right}'`;

          const isValid = !validatedLeft && validatedRight;

          return isValid
            ? ''
            : 'Lot/Plan is not valid';
        }

        return 'Lot/Plan is not valid';
      },
    },
  },
  DNRQPROP: {
    'First Name': {
      minLength: 1,
      maxLength: 100,
      validateFunc: isName,
    },
    'Last Name': {
      minLength: 1,
      maxLength: 100,
      validateFunc: isNameWithWildcard,
    },
    'Company Name': {
      minLength: 3,
      maxLength: 150,
      validateFunc: isCompany,
    },
  },
  DNRIDEAL: {
    'Dealing Number': {
      minLength: 1,
      maxLength: 100,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '')
          .replace(onlyAlphabetic, '');

        return !trimmed.length
          ? ''
          : 'Dealing number is not valid';
      },
    },
  },
  DNRIPLAN: {
    'Plan Number': {
      minLength: 1,
      maxLength: 100,
      validateFunc: (value: string) => {
        if (/^[a-zA-Z]{1,4}\d+$/.test(value)) return '';

        return 'Plan Number is not valid';
      },
    },
  },
  // VIC
  LANSTADDR: {
    'Unit Number': {
      minLength: 1,
      maxLength: 10,
      validateFunc: alwaysValid,
    },
    'Street Number': {
      minLength: 1,
      maxLength: 10,
      validateFunc: alwaysValid,
    },
    'Street Name': {
      minLength: 1,
      maxLength: 30,
      validateFunc: alwaysValid,
    },
    Suburb: {
      minLength: 1,
      maxLength: 30,
      validateFunc: alwaysValid,
    },
    Postcode: {
      minLength: 1,
      maxLength: 4,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '').length;

        return !trimmed
          ? ''
          : 'Not a valid postcode';
      },
    },
  },
  LANLOTPLN: {
    'Lot/Plan Number': {
      minLength: 1,
      maxLength: 30,
      validateFunc: (value: string) => {
        const isWithSlash = /\//.test(value);

        if (!isWithSlash) {
          const split = value.split(/(\D{2})/);

          if (split.length === 3) {
            const [left, middle, right] = split;

            if (!left.length) return 'Lot is required';

            const validatedLeft = left.replace(onlyDigits, '')
              .replace(onlyAlphabetic, '').length;
            const validatedMiddle = /^([RLTSC]P|[PC]S)$/i.test(middle);
            const validatedRight = /^\d+[a-zA-Z]?$/i.test(right);

            if (!validatedMiddle || !validatedRight) return `Not a valid Plan No '${middle}${right}'`;

            if (!validatedMiddle || !validatedRight) {
              let message = 'Not a valid Plan';

              if (middle.length || right.length) message += ` No '${middle}${right}'`;

              return message;
            }

            const isValid = !validatedLeft && validatedMiddle && validatedRight;

            return isValid
              ? ''
              : 'Lot/Plan is not valid';
          }

          return 'Lot/Plan is not valid';
        }

        const split = value.split('/');

        if (split.length === 2) {
          const [left, right] = split;

          if (!left.length) return 'Lot is required';

          const validatedLeft = left.replace(onlyDigits, '')
            .replace(onlyAlphabetic, '').length;
          const validatedRight = /^([RLTSC]P|[PC]S)\d+[a-zA-Z]?$/i.test(right);

          if (!validatedRight) {
            let message = 'Not a valid Plan';

            if (right.length) message += ` No '${right}'`;

            return message;
          }

          const isValid = !validatedLeft && validatedRight;

          return isValid
            ? ''
            : 'Invalid format';
        }

        return 'Lot/Plan is not valid';
      },
    },
  },
  LANDIGI: {
    'Instrument Number': {
      minLength: 1,
      maxLength: 15,
      validateFunc: alwaysValid,
    },
  },
  LANAPPLIC: {
    'Application Index': {
      minLength: 1,
      maxLength: 100,
      validateFunc: (value: string) => {
        if (value[0] !== 'A' || value[1] !== 'P') return 'Application type is invalid, it must equal \'AP\'';
        if (/^AP\d+[a-zA-Z]?$/.test(value)) return '';

        return 'Application type is invalid';
      },
    },
  },
  LANSPI: {
    SPI: {
      minLength: 1,
      maxLength: 150,
      validateFunc: (value: string) => {
        if (/^[a-zA-Z0-9]+[~]?[0-9]?[\\]?[a-zA-Z0-9]*([RTLCP]P|PS|PC)[a-zA-Z0-9]+$/i.test(value)) return '';

        return 'Invalid format';
      },
    },
  },
  LANCPN: {
    'Council Number': {
      minLength: 1,
      maxLength: 150,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '').length;

        return !trimmed
          ? ''
          : 'Invalid characters in council number';
      },
    },
  },
  'INT-VICONS': {
    'First Name': {
      minLength: 1,
      maxLength: 100,
      validateFunc: isName,
    },
    'Last Name': {
      minLength: 1,
      maxLength: 100,
      validateFunc: isName,
    },
    'Organisation Name': {
      minLength: 1,
      maxLength: 150,
      validateFunc: isName,
    },
  },
  // SA
  SATITLEDTLS: {
    'Volume/Folio': {
      minLength: 3,
      maxLength: 20,
      validateFunc: (value: string) => {
        if (/^\d+\/\d+$/.test(value)) return '';

        return 'Title reference is not valid';
      },
    },
  },
  SASTADR: {
    Level: {
      minLength: 1,
      maxLength: 3,
      validateFunc: alwaysValid,
    },
    Lot: {
      minLength: 1,
      maxLength: 6,
      validateFunc: alwaysValid,
    },
    'Unit Number': {
      minLength: 1,
      maxLength: 9,
      validateFunc: alwaysValid,
    },
    'Street Number': {
      minLength: 1,
      maxLength: 9,
      validateFunc: alwaysValid,
    },
    'Street Name': {
      minLength: 1,
      maxLength: 35,
      validateFunc: alwaysValid,
    },
    'Suburb/Locality': {
      minLength: 1,
      maxLength: 25,
      validateFunc: alwaysValid,
    },
  },
  'INT-SAPLNPRCLS': {
    Parcel: {
      minLength: 1,
      maxLength: 50,
      validateFunc: alwaysValid,
    },
    'Plan Number': {
      minLength: 1,
      maxLength: 50,
      validateFunc: alwaysValid,
    },
  },
  SATITLEOWNER: {
    'First Name': {
      minLength: 1,
      maxLength: 50,
      validateFunc: isName,
    },
    'Last Name': {
      minLength: 1,
      maxLength: 50,
      validateFunc: isName,
    },
    'Organisation Name or Surname': {
      minLength: 1,
      maxLength: 120,
      validateFunc: alwaysValid,
    },
    ACN: {
      minLength: 9,
      maxLength: 9,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '').length;

        return !trimmed
          ? ''
          : 'ACN must be a 9 digit numerical value';
      },
    },
  },
  SADEALING: {
    'Dealing Number': {
      minLength: 1,
      maxLength: 10,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '')
          .replace(onlyAlphabetic, '')
          .length;

        return !trimmed
          ? ''
          : 'Dealing Number is not in the correct format';
      },
    },
  },
  SADEALDETAIL: {
    'Dealing Number': {
      minLength: 1,
      maxLength: 10,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '')
          .replace(onlyAlphabetic, '')
          .length;

        return !trimmed
          ? ''
          : 'Dealing Number is not in the correct format';
      },
    },
  },
  // ACT
  ACTVF: {
    'Volume/Folio': {
      minLength: 3,
      maxLength: 50,
      validateFunc: (value: string) => {
        if (/\d+\/\d+/.test(value)) return '';

        return 'Title reference is not valid';
      },
    },
  },
  ACTA: {
    'Unit Number': {
      minLength: 1,
      maxLength: 9,
      validateFunc: alwaysValid,
    },
    'Street Number': {
      minLength: 1,
      maxLength: 9,
      validateFunc: alwaysValid,
    },
    'Street Name': {
      minLength: 1,
      maxLength: 35,
      validateFunc: alwaysValid,
    },
    Suburb: {
      minLength: 1,
      maxLength: 25,
      validateFunc: alwaysValid,
    },
  },
  ACTP: {
    Section: {
      minLength: 1,
      maxLength: 4,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '').length;

        return !trimmed
          ? ''
          : 'Section only allows numeric characters';
      },
    },
    Block: {
      minLength: 1,
      maxLength: 4,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '').length;

        return !trimmed
          ? ''
          : 'Block only allows numeric characters';
      },
    },
    Unit: {
      minLength: 1,
      maxLength: 3,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '').length;

        return !trimmed
          ? ''
          : 'Unit only allows numeric characters';
      },
    },
  },
  ACTON: {
    'Given Names': {
      minLength: 1,
      maxLength: 50,
      validateFunc: isName,
    },
    Surname: {
      minLength: 1,
      maxLength: 50,
      validateFunc: isName,
    },
    Name: {
      minLength: 1,
      maxLength: 120,
      validateFunc: isName,
    },
  },
  ACTDP: {
    'Plan Number': {
      minLength: 1,
      maxLength: 100,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '').length;

        return !trimmed
          ? ''
          : 'Plan Number only allows numeric characters';
      },
    },
  },
  // NT
  NTCT: {
    'Volume/Folio': {
      minLength: 3,
      maxLength: 50,
      validateFunc: (value: string) => {
        if (/\d+\/\d+/.test(value)) return '';

        return 'Title reference is not valid';
      },
    },
    Lot: {
      minLength: 1,
      maxLength: 50,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '').length;

        return !trimmed
          ? ''
          : 'Lot is not valid';
      },
    },
    Town: {
      minLength: 1,
      maxLength: 50,
      validateFunc: alwaysValid,
    },
    'Unit Number': {
      minLength: 1,
      maxLength: 9,
      validateFunc: alwaysValid,
    },
    'Street Number': {
      minLength: 1,
      maxLength: 9,
      validateFunc: alwaysValid,
    },
    'Street Name': {
      minLength: 1,
      maxLength: 35,
      validateFunc: alwaysValid,
    },
    'Suburb/Locality': {
      minLength: 1,
      maxLength: 25,
      validateFunc: alwaysValid,
    },
  },
  NTPLAN: {
    'Plan Number': {
      minLength: 1,
      maxLength: 10,
      validateFunc: alwaysValid,
    },
  },
  // TAS
  TASFT: {
    'Volume/Folio': {
      minLength: 3,
      maxLength: 100,
      validateFunc: (value: string) => {
        if (/\d+\/\d+/.test(value)) return '';

        return 'Title reference is not valid';
      },
    },
  },
  TASSTADR: {
    'Unit Number': {
      minLength: 1,
      maxLength: 9,
      validateFunc: alwaysValid,
    },
    'Street Number': {
      minLength: 1,
      maxLength: 9,
      validateFunc: alwaysValid,
    },
    'Street Name': {
      minLength: 1,
      maxLength: 35,
      validateFunc: alwaysValid,
    },
    Suburb: {
      minLength: 1,
      maxLength: 25,
      validateFunc: alwaysValid,
    },
  },
  TASON: {
    'Given Names': {
      minLength: 1,
      maxLength: 50,
      validateFunc: isName,
    },
    Surname: {
      minLength: 1,
      maxLength: 50,
      validateFunc: isName,
    },
    Name: {
      minLength: 1,
      maxLength: 120,
      validateFunc: isName,
    },
  },
  TASDOCS: {
    'Dealing Number': {
      minLength: 1,
      maxLength: 10,
      validateFunc: (value: string) => {
        const trimmed = value.replace(onlyDigits, '')
          .replace(onlyAlphabetic, '')
          .length;

        return !trimmed
          ? ''
          : 'Dealing Number is not in the correct format';
      },
    },
  },
};

export const validateMatter = (matter: string) => {
  const trimmed = matter.trim();

  if (!trimmed) return 'Matter reference is required';
  if (trimmed.length < 3) return 'At least 3 symbols';
  if (trimmed.length > 100) return 'Maximum character limit exceeded';

  return '';
};

// Return result for smth like "isError" field.
const servicesValidation = (
  value: string,
  productId: string,
  inputName: string,
  isRequired: boolean = false,
): string => {
  if (validationRules[productId] && validationRules[productId][inputName]) {
    const rules = validationRules[productId][inputName];

    if (rules) {
      const {
        minLength,
        maxLength,
        validateFunc,
      } = rules;

      if (isRequired || value.length) {
        if (value.length < minLength) {
          if (value.length) return 'Value is too short';
          return 'Field is required';
        }
        if (value.length > maxLength) return 'Value is too long';

        return validateFunc(value);
      }

      return '';
    }
  }

  if (isRequired && !value) return 'Field is required';

  return '';
};

export default servicesValidation;

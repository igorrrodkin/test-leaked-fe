import { CommonInputTypes } from '@/store/reducers/order';

import { ExistingRegions, getRegionsSelectorData } from '@/utils/getRegionsData';
import isNumber from '@/utils/isNumber';
import { ExtendedCommonInputTypes } from '@/utils/servicesValidation';

export default (
  inputs: CommonInputTypes[],
  region: ExistingRegions,
): ExtendedCommonInputTypes[] => inputs.map((el) => {
  let baseInput: ExtendedCommonInputTypes;

  if (el.type === 'text' || el.type === 'textarea') {
    baseInput = {
      ...el,
      value: '',
      isError: false,
      errorMessage: '',
    };
  }
  if (el.type === 'dropdown') {
    baseInput = {
      ...el,
      keys: getRegionsSelectorData[region][el.keys[0]],
      value: isNumber(el.defaultSelected) ? el.defaultSelected : undefined,
      isError: false,
      errorMessage: '',
    };
  }
  if (el.type === 'checkbox') {
    baseInput = {
      ...el,
      value: el.value,
      isError: false,
      errorMessage: '',
    };
  }

  return baseInput!;
});

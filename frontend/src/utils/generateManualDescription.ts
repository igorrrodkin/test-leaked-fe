import formatByMask from '@/utils/formatByMask';
import { ExtendedCommonInputTypes } from '@/utils/servicesValidation';

export default (items: ExtendedCommonInputTypes[], mask: string | undefined) => {
  let result: string;

  if (mask) {
    const valuesForMask = {};

    items.forEach((el) => {
      if (el.type === 'checkbox') return;

      let elValue = '';

      if ('descriptionPrefix' in el) elValue += el.descriptionPrefix;
      elValue += el.type === 'dropdown' ? el.keys[el.value!] : el.value;

      valuesForMask[el.label] = elValue;
    });

    result = formatByMask(mask, valuesForMask);
  } else {
    result = items
      .map((el) => {
        let temp = '';

        if (el.type === 'checkbox') return temp;
        if ('descriptionPrefix' in el) temp += el.descriptionPrefix;
        if (el.type === 'dropdown') return temp + el.keys[el.value!];

        return temp + el.value;
      })
      .join(' ');
  }

  return result.trim();
};

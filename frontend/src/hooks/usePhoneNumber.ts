import { useState } from 'react';

import { OnChange } from '@/hooks/useInput';

import { onlyDigits } from '@/utils/servicesValidation';

export const isPhoneNumberValid = (value: string) => {
  const regexp = /^\+?\d{6,}$/;

  return regexp.test(value);
};

export default (initialValue = ''): [string, OnChange] => {
  const [phone, setPhone] = useState(initialValue);

  const onChange: OnChange = (evt) => {
    const valueInput = (typeof evt === 'string' ? evt : evt.target.value).trim();
    let replaced = valueInput.replace(onlyDigits, '');

    if (!replaced.length) {
      setPhone(valueInput);
      return;
    }

    if (replaced.length === 1 && valueInput[0] === '+') {
      replaced = replaced.replace('+', '');

      if (replaced.length) return;

      setPhone(valueInput);
    }
  };

  return [phone, onChange];
};

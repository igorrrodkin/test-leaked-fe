import { useCallback, useState } from 'react';

import useDebounce from '@/hooks/useDebounceCallback';

export default <T>(
  value: T, callback: (search: T) => void, startSearchLength = 3, delay = 500,
): [boolean] => {
  const [previousValue, setPreviousValue] = useState<T | null>(null);

  const formatSearchValue = (search: T) => {
    switch (typeof search) {
      case 'string':
        return (search.length >= startSearchLength ? search : '') as T;
      default:
        return search;
    }
  };

  const searchCallback = useCallback(() => {
    if (previousValue !== formatSearchValue(value)) {
      callback(formatSearchValue(value));
    }

    setPreviousValue(formatSearchValue(value));
  }, [previousValue, value]);

  const [isDebounce] = useDebounce(searchCallback, delay);

  return [isDebounce];
};

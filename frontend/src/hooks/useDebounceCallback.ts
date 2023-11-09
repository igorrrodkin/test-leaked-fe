import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay: number = 500): [boolean, T] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [debounce, setDebounce] = useState<ReturnType<typeof setTimeout>>();

  const clearInterval = (interval?: ReturnType<typeof setTimeout>) => {
    if (interval) {
      clearTimeout(interval);
      setDebounce(undefined);
    }
  };

  useEffect(() => {
    clearInterval(debounce);

    const timer = setTimeout(() => {
      setDebouncedValue(value);

      clearInterval(debounce);
    }, delay);

    setDebounce(timer);
  }, [value, delay]);

  return [!!debounce, debouncedValue];
}

export default useDebounce;

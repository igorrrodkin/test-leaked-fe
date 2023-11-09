import { useEffect, useRef } from 'react';

export default () => {
  const isMountRef = useRef(true);

  useEffect(() => {
    isMountRef.current = false;
  }, []);

  return isMountRef.current;
};

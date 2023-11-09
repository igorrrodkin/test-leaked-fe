import { useEffect } from 'react';

const useModalWindow = (overflow?: string) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow || originalStyle;
    };
  }, []);
};

export default useModalWindow;

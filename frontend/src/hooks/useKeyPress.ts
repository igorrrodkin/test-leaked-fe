import { useEffect, useState } from 'react';

export default (targetKey: string, preventDefault?: boolean) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const keyDownHandler = (event: KeyboardEvent) => {
    if (event.key === targetKey || event.code === targetKey) {
      setKeyPressed(true);

      if (preventDefault) {
        event.preventDefault();
      }
    }
  };

  const keyUpHandler = (event: KeyboardEvent) => {
    if (event.key === targetKey || event.code === targetKey) {
      setKeyPressed(false);

      if (preventDefault) {
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  return keyPressed;
};

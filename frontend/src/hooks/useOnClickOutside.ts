import React, { useEffect } from 'react';

import useToggle, { HandleToggle } from '@/hooks/useToggle';

export type Event = React.SyntheticEvent;
export type Ref = HTMLDivElement | HTMLUListElement | HTMLButtonElement;
type returnType<TYPE extends Ref> = [React.RefObject<TYPE>, boolean, HandleToggle];

const useOnClickOutside = <T extends Ref>(initialVisible: boolean = false, elRef?: HTMLDivElement): returnType<T> => {
  const [isVisible, toggleIsVisible] = useToggle(initialVisible);
  const containerRef = React.useRef<T>(null);

  useEffect(() => {
    const listener = (e: Event) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Ref)) {
        toggleIsVisible(false);
      }
    };

    if (elRef) {
      elRef.addEventListener('click', listener as any);
    } else document.body.addEventListener('click', listener as any);

    return () => {
      if (elRef) {
        elRef.removeEventListener('click', listener as any);
      } else document.body.removeEventListener('click', listener as any);
    };
  }, []);

  return [containerRef, isVisible, toggleIsVisible];
};

export default useOnClickOutside;

import React, { useEffect } from 'react';

export type Event = React.SyntheticEvent;
export type Callback = () => void;
export type Ref = HTMLDivElement;

export default (callback: Callback) => {
  const containerRef = React.useRef<Ref>(null);

  useEffect(() => {
    const listener = (e: Event) => {
      if (
        containerRef.current
        && !containerRef.current.contains(
          (e.target as Ref),
        )
      ) {
        callback();
      }

      return null;
    };
    document.body.addEventListener('mousedown', listener as any);

    return () => {
      document.body.addEventListener('mousedown', listener as any);
    };
  }, [callback]);

  return containerRef;
};

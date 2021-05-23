import { RefObject, useEffect, useState } from 'react';

export function useResizeObserver(
  ref: RefObject<HTMLElement>,
  callback: ResizeObserverCallback,
): void {
  const [observer, setObserver] = useState<ResizeObserver>(() => new ResizeObserver(callback));

  useEffect(() => {
    setObserver(new ResizeObserver(callback));
  }, [callback]);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      observer.observe(el);
    }
    return () => {
      observer.disconnect();
    };
  }, [observer, ref]);
}

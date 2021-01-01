import React, { useLayoutEffect, useState } from 'react';

export function useElementSize(ref: React.RefObject<HTMLElement>): [number, number] {
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useLayoutEffect(() => {
    const el = ref.current;
    function updateSize() {
      if (el) {
        const { clientWidth, clientHeight } = el;
        setSize([clientWidth, clientHeight]);
      }
    }

    if (el) {
      el.addEventListener('resize', updateSize);
      updateSize();
    }
    return () => {
      if (el) {
        el.removeEventListener('resize', updateSize);
      }
    };
  }, [ref]);
  return size;
}

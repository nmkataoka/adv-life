import { useState, RefObject, useCallback } from 'react';
import { useResizeObserver } from './useResizeObserver';

export function useElementSize(ref: RefObject<HTMLElement>): [number, number] {
  const [size, setSize] = useState<[number, number]>([0, 0]);

  const resizeCallback = useCallback<ResizeObserverCallback>((entries) => {
    const { blockSize: height, inlineSize: width } = entries[0].borderBoxSize[0];
    setSize([width, height]);
  }, []);

  useResizeObserver(ref, resizeCallback);
  return size;
}

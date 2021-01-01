import { useOnWheel } from '5-react-components/useOnWheel';
import { RefObject, useCallback, useEffect, useState } from 'react';

export default function useZoomOnScroll(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  min = 1,
  max = 2,
): number {
  const [[prevScale, scale], setScale] = useState([1, 1]);

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const { deltaY } = e;
      setScale(([, sc]) => {
        return [sc, Math.min(max, Math.max(min, sc * (1 - deltaY * 0.0001)))];
      });
    },
    [max, min],
  );

  useOnWheel(canvasRef, handleScroll);

  // Scale the canvas whenever the scale changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        /* ctx.scale scales the current canvas by a factor, not the absolute scale.
         * Since we store the absolute scale, we need to back calculate the factor to scale by.
         */
        const scaleChange = scale / prevScale;
        ctx.scale(scaleChange, scaleChange);
      }
    }
  }, [canvasRef, prevScale, scale]);

  // Returns scale so that the caller can detect when the scale changes
  return scale;
}

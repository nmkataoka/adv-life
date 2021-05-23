import { useOnWheel } from '5-react-components/useOnWheel';
import { NMath } from '8-helpers/math';
import { RefObject, useCallback, useEffect, useState } from 'react';

export default function useZoomOnScroll(
  canvasRef: RefObject<HTMLCanvasElement>,
  min = 1,
  max = 2,
): number {
  const [scale, setScale] = useState(1);

  // On mount, the canvas may resize itself based on the window, so let's read the scale from the canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      setScale(ctx.getTransform().a);
    }
  }, [canvasRef]);

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const { deltaY } = e;
      setScale((sc) => {
        return NMath.clamp(sc * (1 - deltaY * 0.0001), min, max);
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
        const prevScale = ctx.getTransform().a;
        const scaleChange = scale / prevScale;
        ctx.scale(scaleChange, scaleChange);
      }
    }
  }, [canvasRef, scale]);

  // Returns scale so that the caller can detect when the scale changes
  // BUG: this seems to be 2x the scale value on the canvas transform. Maybe an issue with prevScale on mount?
  return scale;
}

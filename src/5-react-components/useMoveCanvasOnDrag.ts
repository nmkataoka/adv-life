import { Vector2 } from '8-helpers/math';
import React, { useState, RefObject, MouseEventHandler } from 'react';

export function useMoveCanvasOnDrag(canvasRef: RefObject<HTMLCanvasElement>): {
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
  onMouseMove: MouseEventHandler;
  translation: Vector2;
} {
  const [startMousePos, setStartMousePos] = useState<Vector2 | undefined>(undefined);
  const [translation, setTranslation] = useState(new Vector2(0, 0));

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setStartMousePos(new Vector2(e.clientX, e.clientY));
  };

  const onMouseUp = () => {
    setStartMousePos(undefined);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (startMousePos) {
      e.preventDefault();
      const { x: startX, y: startY } = startMousePos;
      const canvasScale = canvasRef.current?.getContext('2d')?.getTransform().a ?? 1;

      // Assume no zooming happened during the drag event
      const newTranslationX = (e.clientX - startX) / canvasScale;
      const newTranslationY = (e.clientY - startY) / canvasScale;

      // TODO: clamp translation

      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.translate(newTranslationX - translation.x, newTranslationY - translation.y);
      }
      setTranslation(new Vector2(newTranslationX, newTranslationY));
    }
  };

  return { onMouseDown, onMouseUp, onMouseMove, translation };
}

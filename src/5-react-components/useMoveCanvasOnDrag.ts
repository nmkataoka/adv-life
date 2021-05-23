import React, { useState, RefObject, MouseEventHandler } from 'react';

export function useMoveCanvasOnDrag(canvasRef: RefObject<HTMLCanvasElement>): {
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
  onMouseMove: MouseEventHandler;
  translation: { x: number; y: number };
} {
  const [lastMousePos, setLastMousePos] = useState<React.MouseEvent | undefined>(undefined);
  const [translation, setTranslation] = useState({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setLastMousePos(e);
  };

  const onMouseUp = () => {
    setLastMousePos(undefined);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (lastMousePos) {
      e.preventDefault();
      const { clientX: startX, clientY: startY } = lastMousePos;

      // For some reason this value seems to be half of the `scale` in useWorldMap
      const canvasScale = canvasRef.current?.getContext('2d')?.getTransform().a ?? 1;

      // Assume no zooming happened during the drag event
      const dragX = (e.clientX - startX) / canvasScale;
      const dragY = (e.clientY - startY) / canvasScale;

      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.translate(dragX, dragY);
      }
      setLastMousePos(e);
      setTranslation({
        x: translation.x + dragX,
        y: translation.y + dragY,
      });
    }
  };

  return { onMouseDown, onMouseUp, onMouseMove, translation };
}

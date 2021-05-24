import { NMath, Vector2 } from '8-helpers/math';
import React, { useCallback, useState, RefObject, MouseEventHandler } from 'react';
import { useOnWheel } from '5-react-components/useOnWheel';

/**
 * Clamps a translation so you can't pan the map past its edges.
 * @param translation The translation to clamp
 * @param scale The current scale. Translation is assumed to be in unscaled coordinates.
 * @param canvas The canvas element.
 * @param aspectRatio The aspect ratio (w/h) of the image bitmap.
 * @returns The clamped translation.
 */
const clampTranslation = (
  translation: Vector2,
  scale: number,
  canvas: HTMLCanvasElement,
  aspectRatio: number,
): Vector2 => {
  /**
   * Default behavior of useDataLayerRenderer (this tight coupling should be refactored)
   * is that the map is 100% of the canvas height when scale = 1.
   * Therefore, if scale = 2, the map is 2x the canvas height, so we can translate up to 50% of the map height.
   * Remember that the translation is in unscaled coordinates, so it should always be less than 100% of the map height.
   * If scale = 4, the map is 4x the canvas height, so we can translate up to 75% of the canvas height.
   */

  const maxYTranslation = (1 - 1 / scale) * canvas.height;
  const newTranslationY = NMath.clamp(translation.y, -maxYTranslation, 0);

  /**
   * For width, since the canvas is scaled based on the height, we need to factor in the difference in aspect
   * ratio of the canvas vs the map image. This makes the math a little trickier.
   *
   * Following math still relies on image being default rendered as 100% of the canvas height.
   */
  const canvasAspectRatio = canvas.width / canvas.height;
  const maxXTranslation = (aspectRatio / canvasAspectRatio - 1 / scale) * canvas.width;
  const newTranslationX = NMath.clamp(translation.x, -maxXTranslation, 0);
  return new Vector2(newTranslationX, newTranslationY);
};

/**
 * Adds zoom on scroll and drag-to-pan behavior to a canvas object.
 * @param canvasRef The canvas ref
 * @param aspectRatio The aspect ratio (width/height) of the map data (or image), NOT the canvas!
 * @returns Event handlers for the canvas and the current translation (unscaled coordinates)
 */
export function useMapInteraction(
  canvasRef: RefObject<HTMLCanvasElement>,
  aspectRatio: number,
  minScroll = 1,
  maxScroll = 2,
): {
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
  onMouseMove: MouseEventHandler;
  translation: Vector2;
  scale: number;
} {
  const [{ scale, translation }, setParams] = useState<{ scale: number; translation: Vector2 }>({
    scale: 1,
    translation: new Vector2(),
  });

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const { deltaY } = e;
      const canvas = canvasRef.current;
      if (canvas) {
        setParams(({ scale: oldScale, translation: oldTranslation }) => {
          const newScale = NMath.clamp(oldScale * (1 - deltaY * 0.0001), minScroll, maxScroll);
          return {
            scale: newScale,
            // Depending on the anchor point, when zooming out our current translation may
            // become out of bounds, so we need to re-clamp the translation when zooming.
            translation: clampTranslation(oldTranslation, newScale, canvas, aspectRatio),
          };
        });
      }
    },
    [aspectRatio, canvasRef, maxScroll, minScroll],
  );

  useOnWheel(canvasRef, handleScroll);
  const [startInfo, setStartInfo] =
    useState<{ mousePos: Vector2; translation: Vector2 } | undefined>(undefined);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setStartInfo({
      mousePos: new Vector2(e.clientX, e.clientY),
      translation,
    });
  };

  const onMouseUp = () => {
    setStartInfo(undefined);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (startInfo) {
      e.preventDefault();
      const {
        mousePos: { x: startX, y: startY },
        translation: startTranslation,
      } = startInfo;
      const canvas = canvasRef.current;
      if (canvas) {
        // Assume no zooming happened during the drag event
        const newTranslation = new Vector2(
          (e.clientX - startX) / scale + startTranslation.x,
          (e.clientY - startY) / scale + startTranslation.y,
        );
        setParams(({ scale: prevScale }) => {
          return {
            scale: prevScale,
            translation: clampTranslation(newTranslation, prevScale, canvas, aspectRatio),
          };
        });
      }
    }
  };

  return { onMouseDown, onMouseUp, onMouseMove, translation, scale };
}

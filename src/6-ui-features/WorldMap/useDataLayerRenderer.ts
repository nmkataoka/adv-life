import { useCallback, useEffect, useRef, useState, RefObject, useMemo } from 'react';
import { DataLayer } from '1-game-code/World';
import { DeepReadonly } from 'ts-essentials';
import { useIsTest } from '6-ui-features/TestContext';
import throttle from 'lodash.throttle';
import { Color } from './Color';
import PixelMap from './PixelMap';

/** Returns a function that draws the DataLayer onto a canvas via PixelMap and ImageBitmap
 *
 * Returns the renderer rather than calling it so that you can choose when to redraw.
 */
export function useDataLayerRenderer(
  canvasRef: RefObject<HTMLCanvasElement>,
  colorFunc: (num: number) => Color,
  dataLayer?: DeepReadonly<DataLayer>,
  useShearedElev = false,
  debounceMs = 50,
): () => void {
  const isTest = useIsTest();
  const pixelMap = useRef<PixelMap | undefined>();
  const [imageBitmap, setImageBitmap] = useState(null as ImageBitmap | null);

  const drawImage = useCallback(
    (renderer: ImageBitmap) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Let's clear the canvas before redrawing
          // To clear the canvas, we first need to remove any transformations
          ctx.save();

          // Use the identity matrix while clearing the canvas
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Restore the transform
          ctx.restore();

          // By default, the map is scaled to fit 100% of the page height while preserving the aspect ratio
          const { height: imageHeight, width: imageWidth } = renderer;
          const aspectRatio = imageHeight / imageWidth;
          const cW = canvas.height / aspectRatio;
          const cH = canvas.height;

          ctx.drawImage(renderer, 0, 0, cW, cH);
        }
      }
    },
    [canvasRef],
  );

  // If the dataLayer size changes or colorFunc changes, we need to re-instantiate the pixelmap
  useEffect(() => {
    if (!dataLayer) return; // Nothing to render
    if (
      !pixelMap.current ||
      pixelMap.current.height !== dataLayer.height ||
      pixelMap.current.width !== dataLayer.width ||
      pixelMap.current.coloringFunc !== colorFunc
    ) {
      pixelMap.current = new PixelMap(dataLayer, colorFunc);
    }
  }, [dataLayer, colorFunc]);

  // Update the pixel map and bitmap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pixelMap.current || !dataLayer) return;

    // All the canvas and drawing stuff doesn't exist in node-env.
    if (isTest) return;

    pixelMap.current.updateFromDataLayer(dataLayer, useShearedElev);
    const img = pixelMap.current.toImageData();

    void createImageBitmap(img).then((bitmap) => setImageBitmap(bitmap));
  }, [canvasRef, drawImage, dataLayer, useShearedElev, isTest]);

  return useMemo(
    () =>
      throttle(() => {
        if (imageBitmap) {
          drawImage(imageBitmap);
        }
      }, debounceMs),
    [drawImage, imageBitmap, debounceMs],
  );
}

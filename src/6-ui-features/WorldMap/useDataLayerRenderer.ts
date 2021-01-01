import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DataLayer } from '1-game-code/World';
import { Color } from './Color';
import PixelMap from './PixelMap';

/** Renders a DataLayer onto a canvas via PixelMap and ImageBitmap */
export function useDataLayerRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  colorFunc: (num: number) => Color,
  dataLayer?: DataLayer,

  /** This argument should come from `useZoomOnScroll` */
  scale = 1,
  useShearedElev = false,
): void {
  const pixelMap = useRef<PixelMap | undefined>();
  const [imageBitmap, setImageBitmap] = useState(null as ImageBitmap | null);

  const drawImage = useCallback(
    (renderer: ImageBitmap) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const cW = canvas.width;
        const cH = canvas.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(renderer, 0, 0, cW, cH);
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

    pixelMap.current.updateFromDataLayer(dataLayer, useShearedElev);
    const img = pixelMap.current.toImageData();

    void createImageBitmap(img).then((bitmap) => setImageBitmap(bitmap));
  }, [canvasRef, drawImage, dataLayer, useShearedElev]);

  // Redraw the image bitmap whenever it changes or we zoom in/out
  useEffect(() => {
    if (imageBitmap) {
      drawImage(imageBitmap);
    }
  }, [drawImage, imageBitmap, scale]);
}

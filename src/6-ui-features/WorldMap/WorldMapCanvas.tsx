import { WorldMap } from '1-game-code/World/WorldMap';
import { getWorldMapLayer } from '3-frontend-api/worldMap';
import { useSelector } from '4-react-ecsal';
import React, { useCallback, useEffect, useRef } from 'react';
import { Color, colorInterp } from './Color';
import PixelMap from './PixelMap';

function colorElevation(elev: number): Color {
  if (elev < 0) {
    // Ocean
    return colorInterp(elev, -6000, 0, [0, 63, 128, 255], [128, 200, 238, 255]);
  }
  // Land
  return colorInterp(elev, 0, 6000, [120, 177, 120, 255], [216, 221, 209, 255]);
}

export default function WorldMapCanvas(): JSX.Element {
  const elevations = useSelector(getWorldMapLayer(WorldMap.Layer.Elevation));
  const pixelMap = useRef(new PixelMap(elevations, colorElevation));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImage = useCallback((renderer: ImageBitmap) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const cW = canvas.width;
      const cH = canvas.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(renderer, 0, 0, cW, cH);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !elevations) return;

    pixelMap.current.updateFromDataLayer(elevations);
    const img = pixelMap.current.toImageData();

    void createImageBitmap(img).then(drawImage);
  }, [drawImage, elevations]);

  return <canvas ref={canvasRef} height={300} width={400} />;
}

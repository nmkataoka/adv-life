import { WorldMap } from '1-game-code/World/WorldMap';
import { getWorldMapLayer } from '3-frontend-api/worldMap';
import { useSelector } from '4-react-ecsal';
import { useSelector as useReduxSelector } from 'react-redux';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RootState } from '7-app/types';
import useZoomOnScroll from '5-react-components/useZoomOnScroll';
import { Color, colorInterp } from './Color';
import PixelMap from './PixelMap';

const colors: Color[] = [
  [0, 5, 70, 255],
  [0, 55, 120, 255],
  [0, 119, 190, 255],
  [137, 207, 245, 255],
  [155, 177, 125, 255],
  [200, 198, 164, 255],
  [220, 230, 220, 220],
];

function colorElevation(elev: number): Color {
  if (elev < -7000) {
    return colors[0];
  }
  if (elev < -5000) {
    return colorInterp(elev, -7000, -5000, colors[0], colors[1]);
  }
  if (elev < -2000) {
    return colorInterp(elev, -5000, -2000, colors[1], colors[2]);
  }
  if (elev < 0) {
    return colorInterp(elev, -2000, 0, colors[2], colors[3]);
  }
  if (elev < 2000) {
    return colorInterp(elev, 0, 2000, colors[4], colors[5]);
  }
  if (elev < 9000) {
    return colorInterp(elev, 2000, 9000, colors[5], colors[6]);
  }
  return colors[6];
}

type WorldMapCanvasProps = {
  height: number;
  width: number;
};

export default function WorldMapCanvas({ height, width }: WorldMapCanvasProps): JSX.Element {
  const useShearedElev = useReduxSelector((state: RootState) => state.worldMap.useShearedElev);
  const [imageBitmap, setImageBitmap] = useState(null as ImageBitmap | null);
  const elevations = useSelector(getWorldMapLayer(WorldMap.Layer.Elevation));
  const pixelMap = useRef(new PixelMap(elevations, colorElevation));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scale = useZoomOnScroll(canvasRef);

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

    pixelMap.current.updateFromDataLayer(elevations, useShearedElev);
    const img = pixelMap.current.toImageData();

    void createImageBitmap(img).then((bitmap) => setImageBitmap(bitmap));
  }, [drawImage, elevations, useShearedElev]);

  useEffect(() => {
    if (imageBitmap) {
      drawImage(imageBitmap);
    }
  }, [drawImage, imageBitmap, scale]);

  return <canvas style={{ position: 'absolute' }} ref={canvasRef} height={height} width={width} />;
}

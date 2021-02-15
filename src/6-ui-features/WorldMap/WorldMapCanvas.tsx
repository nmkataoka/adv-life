import { WorldMap } from '1-game-code/World/WorldMap';
import { getWorldMapLayer } from '3-frontend-api/worldMap';
import { useSelector2 } from '4-react-ecsal';
import { useReduxSelector } from '11-redux-wrapper';
import { useRef } from 'react';
import { RootState } from '7-app/types';
import useZoomOnScroll from '5-react-components/useZoomOnScroll';
import { useDataLayerRenderer } from './useDataLayerRenderer';
import { colorElevation } from './coloringFuncs';

type WorldMapCanvasProps = {
  height: number;
  width: number;
};

// This is probably not a great architecture, but I won't know how to refactor this until
// we have more layers. Which we may not get for a long time if we skip climate.
//
// There is significant code overlap with the Map component
export default function WorldMapCanvas({ height, width }: WorldMapCanvasProps): JSX.Element {
  const useShearedElev = useReduxSelector((state: RootState) => state.worldMap.useShearedElev);
  const elevations = useSelector2(getWorldMapLayer(WorldMap.Layer.Elevation));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scale = useZoomOnScroll(canvasRef);

  useDataLayerRenderer(canvasRef, colorElevation, elevations, scale, useShearedElev);

  return <canvas style={{ position: 'absolute' }} ref={canvasRef} height={height} width={width} />;
}

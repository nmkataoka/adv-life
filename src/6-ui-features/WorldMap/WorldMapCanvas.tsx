import { getWorldMapLayer } from '3-frontend-api/worldMap';
import { useSelector2 } from '4-react-ecsal';
import { useReduxSelector } from '11-redux-wrapper';
import { useRef } from 'react';
import { RootState } from '7-app/types';
import useZoomOnScroll from '5-react-components/useZoomOnScroll';
import { layersUiData } from '6-ui-features/WorldGenScene/MapOverlay/layers';
import { useDataLayerRenderer } from './useDataLayerRenderer';

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
  const elevations = useSelector2(getWorldMapLayer('elevation'));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scale = useZoomOnScroll(canvasRef);
  const colorElevation = layersUiData[0].coloringFunc;

  useDataLayerRenderer(canvasRef, colorElevation, elevations, scale, useShearedElev);

  return <canvas style={{ position: 'absolute' }} ref={canvasRef} height={height} width={width} />;
}

import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useDataLayerRenderer } from '6-ui-features/WorldMap/useDataLayerRenderer';
import { getWorldMapLayer } from '3-frontend-api/worldMap';
import { useSelector2 } from '4-react-ecsal';
import useZoomOnScroll from '5-react-components/useZoomOnScroll';
import { useElementSize } from '5-react-components/useElementSize';
import { WorldMapLayer } from '1-game-code/World/DataLayer/WorldMapLayers';
import { layersUiData } from './MapOverlay/layers';
import { MapOverlay } from './MapOverlay';

export function Map(): JSX.Element {
  const [currentLayer, setCurrentLayer] = useState<WorldMapLayer>('elevation');
  const elevations = useSelector2(getWorldMapLayer(currentLayer));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useZoomOnScroll(canvasRef);

  const [width, height] = useElementSize(containerRef);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { coloringFunc } = layersUiData.find((el) => el.key === currentLayer)!;

  useDataLayerRenderer(canvasRef, coloringFunc, elevations, scale);

  return (
    <Container>
      {!elevations && 'No map generated yet.'}
      <FullDiv ref={containerRef}>
        <canvas style={{ position: 'absolute' }} ref={canvasRef} height={height} width={width} />
        {elevations && <MapOverlay currentLayer={currentLayer} onLayerChange={setCurrentLayer} />}
      </FullDiv>
    </Container>
  );
}

const Container = styled.div`
  grid-area: map;

  padding: 1em 2em;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const FullDiv = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

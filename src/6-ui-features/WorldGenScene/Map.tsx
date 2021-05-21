import React, { ReactNode, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useDataLayerRenderer } from '6-ui-features/WorldMap/useDataLayerRenderer';
import { getWorldMapLayer } from '3-frontend-api/worldMap';
import { useSelector2 } from '4-react-ecsal';
import useZoomOnScroll from '5-react-components/useZoomOnScroll';
import { useElementSize } from '5-react-components/useElementSize';
import { WorldMapLayer } from '1-game-code/World/DataLayer/WorldMapLayers';
import { layersUiData } from '../WorldMap/layers';
import { WorldGenOverlay } from './WorldGenOverlay';

interface MapProps {
  children?: ReactNode;
}

export function Map({ children }: MapProps): JSX.Element {
  const [currentLayer, setCurrentLayer] = useState<WorldMapLayer>('elevation');
  const dataLayer = useSelector2(getWorldMapLayer(currentLayer));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useZoomOnScroll(canvasRef);

  const [width, height] = useElementSize(containerRef);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { coloringFunc } = layersUiData.find((el) => el.key === currentLayer)!;

  useDataLayerRenderer(canvasRef, coloringFunc, dataLayer, scale);

  return (
    <Container>
      {!dataLayer && 'No map generated yet.'}
      <FullDiv ref={containerRef}>
        <canvas style={{ position: 'absolute' }} ref={canvasRef} height={height} width={width} />
        {dataLayer && (
          <WorldGenOverlay currentLayer={currentLayer} onLayerChange={setCurrentLayer} />
        )}
        {children}
      </FullDiv>
    </Container>
  );
}

const Container = styled.div`
  grid-area: map;
  height: 100%;
  width: 100%;
`;

const FullDiv = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

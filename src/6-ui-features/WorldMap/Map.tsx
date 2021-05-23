import React, { ReactNode, useEffect } from 'react';
import styled from '@emotion/styled';
import { useMoveCanvasOnDrag } from '5-react-components/useMoveCanvasOnDrag';
import { useDataLayerRenderer } from './useDataLayerRenderer';
import { useWorldMap, WorldMapProvider } from './WorldMapContext';
import { layersUiData } from './layers';

function MapInternal({ children }: { children?: ReactNode }) {
  const { layer, layerData, canvasRef, containerRef, scale, containerWidth, containerHeight } =
    useWorldMap();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { coloringFunc } = layersUiData.find((el) => el.key === layer)!;

  const { onMouseUp, onMouseDown, onMouseMove, translation } = useMoveCanvasOnDrag(canvasRef);
  const drawMap = useDataLayerRenderer(canvasRef, coloringFunc, layerData);

  // Redraw the map on scroll, resize, drag
  useEffect(() => {
    drawMap();
  }, [drawMap, scale, containerWidth, containerHeight, translation]);

  return (
    <Container>
      {!layerData && 'No map generated yet.'}
      <FullDiv ref={containerRef}>
        <canvas
          style={{ position: 'absolute' }}
          ref={canvasRef}
          height={containerHeight}
          width={containerWidth}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        />
        {children}
      </FullDiv>
    </Container>
  );
}

interface MapProps {
  children?: ReactNode;
}

/**
 * The world map.
 *
 * Children can access map data through the hook api.
 */
export function Map({ children }: MapProps): JSX.Element {
  return (
    <WorldMapProvider>
      <MapInternal>{children}</MapInternal>
    </WorldMapProvider>
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

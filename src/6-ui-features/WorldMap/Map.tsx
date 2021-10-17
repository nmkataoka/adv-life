import React, { ReactNode, useEffect } from 'react';
import styled from '@emotion/styled';
import { useMapInteraction } from '5-react-components/useMapInteraction';
import { useDataLayerRenderer } from './useDataLayerRenderer';
import { useWorldMap, WorldMapProvider } from './WorldMapContext';
import { layersUiData } from './layers';

function MapInternal({ children }: { children?: ReactNode }) {
  const { layer, layerData, canvasRef, containerRef, containerWidth, containerHeight } =
    useWorldMap();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { coloringFunc } = layersUiData.find((el) => el.key === layer)!;

  const { render: drawMap, aspectRatio } = useDataLayerRenderer(canvasRef, coloringFunc, layerData);
  const { onMouseUp, onMouseDown, onMouseMove, translation, scale } = useMapInteraction(
    canvasRef,
    aspectRatio,
  );

  // Redraw the map on scroll, resize, drag
  useEffect(() => {
    drawMap(scale, [translation.x, translation.y]);
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
          onMouseLeave={onMouseUp}
        />
        {children}
      </FullDiv>
    </Container>
  );
}

interface MapProps {
  /**
   * If the user doesn't need to toggle overlays for a certain map mode, you can set them here.
   */
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

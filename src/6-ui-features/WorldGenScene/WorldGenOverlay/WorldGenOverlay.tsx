import { getElevationMetadata } from '3-frontend-api/worldMap/getTerrainInfo';
import { useSelector2 } from '4-react-ecsal';
import { MapOverlayContainer, useWorldMap, useWorldMapActions } from '6-ui-features/WorldMap';
import styled from '@emotion/styled';
import { LayerButtons } from './LayerButtons';

export function WorldGenOverlay(): JSX.Element | null {
  const { layer, layerData } = useWorldMap();
  const { setLayer } = useWorldMapActions();
  const elevMeta = useSelector2(getElevationMetadata);

  if (!layerData) return null;

  return (
    <MapOverlayContainer>
      <OverallStatsContainer>
        <b>Terrain Statistics</b>
        {elevMeta && (
          <>
            <div>Min elevation: {elevMeta.minElevation.toFixed(0)} m</div>
            <div>Max elevation: {elevMeta.maxElevation.toFixed(0)} m</div>
            <div>Underwater: {toPercentage(elevMeta.elevationDistribution.underwater)}</div>
            <div>
              Coasts and plains (0-1500 m): {toPercentage(elevMeta.elevationDistribution.low)}
            </div>
            <div>
              Hills, Mountains (1500-3000 m): {toPercentage(elevMeta.elevationDistribution.medium)}
            </div>
            <div>Tall Mountains (3000+ m): {toPercentage(elevMeta.elevationDistribution.high)}</div>
          </>
        )}
      </OverallStatsContainer>
      <LayerButtons currentLayer={layer} onLayerChange={setLayer} />
    </MapOverlayContainer>
  );
}

function toPercentage(val: number): string {
  return `${(val * 100).toFixed(2)}%`;
}

const OverallStatsContainer = styled.div`
  padding: 1em;
  font-size: 1.2em;
  background-color: rgba(0, 0, 0, 0.5);

  display: inline-block;
  pointer-events: none;
`;

import { getElevationMetadata } from '3-frontend-api/worldMap/getTerrainInfo';
import { useSelector } from '4-react-ecsal';
import styled from '@emotion/styled';

export function MapOverlay(): JSX.Element {
  const elevMeta = useSelector(getElevationMetadata);

  return (
    <OverlayContainer>
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
    </OverlayContainer>
  );
}

function toPercentage(val: number): string {
  return `${(val * 100).toFixed(2)}%`;
}

const OverlayContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const OverallStatsContainer = styled.div`
  padding: 1em;
  font-size: 1.2em;
  background-color: rgba(0, 0, 0, 0.5);

  display: inline-block;
`;

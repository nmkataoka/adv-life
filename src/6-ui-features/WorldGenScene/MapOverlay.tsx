import styled from '@emotion/styled';

type MapOverlayProps = {
  tab?: string;
};

export function MapOverlay({ tab }: MapOverlayProps): JSX.Element {
  return <OverlayContainer>Terrain Statistics</OverlayContainer>;
}

const OverlayContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

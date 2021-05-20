import styled from '@emotion/styled';

/** All map overlays should be able to use this as their outer container */
export const MapOverlayContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  pointer-events: none;
`;

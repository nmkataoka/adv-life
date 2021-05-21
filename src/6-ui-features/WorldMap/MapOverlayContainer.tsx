import styled from '@emotion/styled';

/** Map overlays that use flexbox positioning for their elements can use this.
 *
 * Map overlays that use relative positioning for their elements don't need a container.
 * There is already a position: relative container div in `<Map />`<div className="
 */
export const MapOverlayContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  pointer-events: none;
`;

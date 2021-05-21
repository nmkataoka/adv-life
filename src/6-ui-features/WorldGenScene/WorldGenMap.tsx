import { Map } from '6-ui-features/WorldMap';
import { WorldGenOverlay } from './WorldGenOverlay';

export function WorldGenMap(): JSX.Element {
  return (
    <Map>
      <WorldGenOverlay />
    </Map>
  );
}

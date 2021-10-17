import { PoliticalOverlay } from '6-ui-features/WorldMap/PoliticalOverlay';
import { Map } from '6-ui-features/WorldMap';
import { CivMapOverlay } from './CivMapOverlay';

export function CivMap(): JSX.Element {
  return (
    <Map>
      <CivMapOverlay />
      <PoliticalOverlay show />
    </Map>
  );
}

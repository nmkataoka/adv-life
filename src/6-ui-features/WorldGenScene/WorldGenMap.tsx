import { InfoProvider } from '6-ui-features/Info';
import { Map } from '6-ui-features/WorldMap';
import { PoliticalOverlay } from '6-ui-features/WorldMap/PoliticalOverlay';
import { WorldGenOverlay } from './WorldGenOverlay';

export function WorldGenMap(): JSX.Element {
  // TODO: move the Info context higher, doesn't belong here
  return (
    <InfoProvider>
      <Map>
        <PoliticalOverlay />
        <WorldGenOverlay />
      </Map>
    </InfoProvider>
  );
}

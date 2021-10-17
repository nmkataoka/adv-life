import { getAllTowns } from '3-frontend-api';
import { useSelector2 } from '4-react-ecsal';
import { useWorldMap } from '../WorldMapContext';
import { Town } from './Town';

interface PoliticalOverlayProps {
  /** Force show/hide this overlay, overrides the setting from the Map Context */
  show?: boolean;
}

/** Shows towns and (in the future) countries, borders, etc. */
export function PoliticalOverlay({ show }: PoliticalOverlayProps): JSX.Element | null {
  const towns = useSelector2(getAllTowns);
  const { overlayIsActive } = useWorldMap();
  if (show === false || (typeof show === 'undefined' && !overlayIsActive.political)) return null;
  return (
    <>
      {towns?.map(({ coords, townId, name }) => (
        // @ts-expect-error The type 'readonly [number, number]' ... cannot be assigned to the mutable type ...
        <Town key={townId} coords={coords} name={name} />
      ))}
    </>
  );
}

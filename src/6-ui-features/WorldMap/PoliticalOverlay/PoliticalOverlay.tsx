import { getAllTowns } from '3-frontend-api';
import { useSelector2 } from '4-react-ecsal';
import { Town } from './Town';

/** Shows towns and (in the future) countries, borders, etc. */
export function PoliticalOverlay(): JSX.Element {
  const towns = useSelector2(getAllTowns);
  return (
    <>
      {towns?.map(({ coords, townId, name }) => (
        // @ts-expect-error The type 'readonly [number, number]' ... cannot be assigned to the mutable type ...
        <Town key={townId} coords={coords} name={name} />
      ))}
    </>
  );
}

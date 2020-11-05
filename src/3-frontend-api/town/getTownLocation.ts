import { EntityManager } from '0-engine';
import { getInventory } from '3-frontend-api/inventory';
import { Selector } from '4-react-ecsal';
import { getName } from '../name/getName';
import { TownLocationInfo } from './TownLocationInfo';

export const getTownLocation = (townLocationId: number): Selector<TownLocationInfo> => (
  eMgr: EntityManager,
) => {
  const { name = 'Unnamed' } = getName(townLocationId)(eMgr);
  const inventory = getInventory(townLocationId)(eMgr);

  return {
    inventory,
    name,
    townLocationId,
  };
};

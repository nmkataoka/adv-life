import { EntityManager } from '0-engine';
import { getInventory } from '3-frontend-api/inventory';
import { getName } from '../name/getName';
import { TownLocationInfo } from './TownLocationInfo';

export const getTownLocation = (townLocationId: number) => (
  eMgr: EntityManager,
): TownLocationInfo => {
  const { name = 'Unnamed' } = getName(townLocationId)(eMgr);
  const inventory = getInventory(townLocationId)(eMgr);

  return {
    inventory,
    name,
    townLocationId,
  };
};

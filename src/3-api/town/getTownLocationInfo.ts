import { getNameCmpt } from '../getName';
import { TownLocationInfo } from './TownLocationInfo';
import { getInventoryInfo } from '../inventory/getInventoryInfo';

export const getTownLocationInfo = (entityHandle: number): TownLocationInfo => {
  const { name } = getNameCmpt(entityHandle);
  const inventoryInfo = getInventoryInfo(entityHandle);

  return {
    inventory: inventoryInfo,
    name,
  };
};

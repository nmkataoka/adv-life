import { InventoryInfo } from '../inventory/InventoryInfo';

export type TownLocationInfo = {
  inventory: InventoryInfo;
  name: string;
}

export type TownLocationsDict = {
  [key: string]: TownLocationInfo;
}

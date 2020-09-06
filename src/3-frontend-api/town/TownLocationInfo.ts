import { InventoryInfo } from '../inventory/InventoryInfo';

export type TownLocationInfo = {
  inventory: InventoryInfo;
  name: string;
  townLocationId: number;
}

export type TownLocationsDict = {
  [key: string]: TownLocationInfo;
}

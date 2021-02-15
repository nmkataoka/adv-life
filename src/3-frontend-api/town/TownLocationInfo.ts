import { InventoryInfo } from '../inventory/InventoryInfo';

export type TownLocationInfo = {
  readonly inventory: InventoryInfo | undefined;
  readonly name: string;
  readonly townLocationId: number;
};

import { DeepReadonly } from 'ts-essentials';

export type InventorySlotInfo = {
  health: number;
  itemClassId: number;
  materialId: number;
  publicSalePrice: number;
  stackCount: number;
};

export const defaultInventorySlotInfo: DeepReadonly<InventorySlotInfo> = {
  health: 1,
  itemClassId: -1,
  materialId: -1,
  publicSalePrice: 1,
  stackCount: 0,
};

export type InventoryInfo = {
  inventorySlots: InventorySlotInfo[];
  gold: number;
};

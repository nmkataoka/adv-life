export type InventorySlotInfo = {
  itemId: number;
  name: string;
  publicSalePrice: number;
  itemType: string;
};

export type InventoryInfo = {
  inventorySlots: InventorySlotInfo[];
  gold: number;
};

export type InventoryInfosDict = {
  [key: string]: InventoryInfo;
};

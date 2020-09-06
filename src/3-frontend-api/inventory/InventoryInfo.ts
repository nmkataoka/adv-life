export type InventoryStackInfo = {
  itemIds: number[];
  name: string;
  publicSalePrice: number;
  itemType: string;
}

export type InventoryInfo = {
  itemStacks: InventoryStackInfo[];
  gold: number;
}

export type InventoryInfosDict = {
  [key: string]: InventoryInfo;
}

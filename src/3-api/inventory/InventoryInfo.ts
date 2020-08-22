export type InventoryStackInfo = {
  itemIds: number[];
  publicSalePrice: number;
}

export type InventoryInfo = {
  itemStacks: InventoryStackInfo[];
  gold: number;
}

export type InventoryInfosDict = {
  [key: string]: InventoryInfo;
}

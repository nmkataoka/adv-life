import { NComponent } from '../../0-engine';
import { Entity } from '../../0-engine';

export type InventorySlot = {
  itemId: Entity;
  publicSalePrice: number;
};

export class InventoryCmpt implements NComponent {
  public gold = 0;

  public inventorySlots: (InventorySlot | undefined)[];

  public isPlayerInventory: boolean;

  constructor(inventorySize: number, isPlayerInventory = false) {
    this.isPlayerInventory = isPlayerInventory;
    this.inventorySlots = Array(inventorySize).fill(undefined);
  }

  /** @returns The index of the slot in which the item was placed */
  public addItemToNextEmptySlot = (data: InventorySlot): number => {
    for (let i = 0; i < this.inventorySlots.length; ++i) {
      if (this.inventorySlots[i] == null) {
        this.inventorySlots[i] = data;
        return i;
      }
    }

    if (!this.isPlayerInventory) {
      // Merchants have unlimited inventory sizes
      this.inventorySlots.push(data);
      return this.inventorySlots.length - 1;
    }

    return -1;
  };

  public findItemById = (itemId: number): InventorySlot | undefined => {
    const itemData = this.inventorySlots.find((slot) => slot?.itemId.handle === itemId);
    return itemData;
  };

  /** For player inventories, players expect empty slots to be remembered.
   * For merchants, leaving the deleted element saved on performance.
   */
  public removeItemById = (itemId: number): void => {
    const idx = this.inventorySlots.findIndex((slot) => slot?.itemId.handle === itemId);
    if (idx > -1) {
      this.inventorySlots[idx] = undefined;
    }
  };
}

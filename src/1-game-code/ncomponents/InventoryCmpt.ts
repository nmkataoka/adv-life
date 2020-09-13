import { NComponent } from '../../0-engine/ECS/NComponent';
import { Entity } from '../../0-engine/ECS/Entity';

export type InventorySlot = {
  itemId: Entity;
  publicSalePrice: number;
};

export class InventoryCmpt implements NComponent {
  public gold = 0;

  public inventorySlots: (InventorySlot | undefined)[] = [];

  /** @returns The index of the slot in which the item was placed */
  public addItemToNextEmptySlot = (data: InventorySlot): number => {
    for (let i = 0; i < this.inventorySlots.length; ++i) {
      if (this.inventorySlots[i] == null) {
        this.inventorySlots[i] = data;
        return i;
      }
    }
    return -1;
  };

  public findItemById = (itemId: number): InventorySlot | undefined => {
    const itemData = this.inventorySlots.find((slot) => slot?.itemId.handle === itemId);
    return itemData;
  };

  public removeItemById = (itemId: number): void => {
    const idx = this.inventorySlots.findIndex((slot) => slot?.itemId.handle === itemId);
    if (idx > -1) {
      this.inventorySlots[idx] = undefined;
    }
  };
}

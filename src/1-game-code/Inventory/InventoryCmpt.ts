import { NComponent } from '../../0-engine';
import { ItemStackCmpt } from '../Items';

export class InventoryCmpt implements NComponent {
  public gold = 0;

  public inventorySlots: (ItemStackCmpt | undefined)[];

  public isPlayerInventory: boolean;

  constructor(inventorySize: number, isPlayerInventory = false) {
    this.isPlayerInventory = isPlayerInventory;
    this.inventorySlots = Array(inventorySize).fill(undefined);
  }

  /** Add an ItemStackCmpt to the inventory.
   * @param {ItemStackCmpt} item An ItemStackCmpt. Should not be attached to an entity.
   * @returns The index of the slot in which the item was placed */
  public addItemToNextEmptySlot = (item: ItemStackCmpt): number => {
    for (let i = 0; i < this.inventorySlots.length; ++i) {
      if (this.inventorySlots[i] == null) {
        this.inventorySlots[i] = item;
        return i;
      }
    }

    if (!this.isPlayerInventory) {
      // Merchants have unlimited inventory sizes
      this.inventorySlots.push(item);
      return this.inventorySlots.length - 1;
    }

    return -1;
  };

  public getAt = (index: number): ItemStackCmpt | undefined => {
    const itemData = this.inventorySlots[index];
    return itemData;
  };

  /** Leaves empty slot for performance and because for player
   * inventories, empty slots are expected to be remembered.
   */
  public removeAt = (index: number): void => {
    if (index >= 0 && index < this.inventorySlots.length) {
      this.inventorySlots[index] = undefined;
    } else {
      throw new Error('Index out of range');
    }
  };
}

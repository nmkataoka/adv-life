import { NComponent } from '../0-engine/ECS/NComponent';
import { Entity } from '../0-engine/ECS/Entity';

export type InventoryStack = {
  itemIds: Entity[];
  publicSalePrice: number;
}

export class InventoryCmpt implements NComponent {
  public gold = 0;

  public itemStacks: InventoryStack[] = [];
}

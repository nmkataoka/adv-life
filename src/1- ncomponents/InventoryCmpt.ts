import { NComponent } from '../0-engine/ECS/NComponent';
import { Entity } from '../0-engine/ECS/Entity';

export class InventoryCmpt implements NComponent {
  public items: Entity[] = [];
}

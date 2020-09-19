import { Entity, NComponent } from '../../0-engine';

export class HeldItemsCmpt implements NComponent {
  public items: { itemId: Entity }[] = [];
}

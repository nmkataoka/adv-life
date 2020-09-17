import { Entity, NComponent } from '../../../0-engine';

export class WornItemsCmpt implements NComponent {
  public items: { itemId: Entity }[] = [];
}

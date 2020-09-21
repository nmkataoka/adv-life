import { NComponent } from '0-engine';
import { ItemStackCmpt } from '../Items';

export class HeldItemsCmpt implements NComponent {
  public items: ItemStackCmpt[] = [];
}

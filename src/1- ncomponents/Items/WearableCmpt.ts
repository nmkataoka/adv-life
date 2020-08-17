import { NComponent } from '../../0-engine/ECS/NComponent';

/* An item is worn if it won't fall off if the user falls unconscious */
export class WearableCmpt implements NComponent {
  public armorValue = 0;
}

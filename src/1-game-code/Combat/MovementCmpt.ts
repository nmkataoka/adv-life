import { NComponent } from '0-engine';
import { Vector2 } from '8-helpers/math';

export class MovementCmpt implements NComponent {
  public speed = 1;

  public destination = new Vector2(0, 0);
}

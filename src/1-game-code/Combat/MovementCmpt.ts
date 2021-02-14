import { NComponent } from '0-engine';
import { Vector2 } from '8-helpers/math';

export class MovementCmpt extends NComponent {
  public speed = 1;

  public destination: Vector2 = new Vector2(0, 0);
}

import { NComponent } from '0-engine';
import { Vector2 } from '8-helpers/math';

// Controls the order in which units are displayed on the board.
// Positions may not be continuous or whole numbers.
// E.g. [1, 3, 99.5, 100] is a valid set of unit positions
export class CombatPositionCmpt implements NComponent {
  public position = -1;

  public pos: Vector2 = new Vector2(0, 0);
}

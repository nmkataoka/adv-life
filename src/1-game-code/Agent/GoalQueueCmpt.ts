import { NComponent } from '0-engine';
import { BoundAction } from './BoundAction';

export class GoalQueueCmpt implements NComponent {
  public nextAction?: BoundAction;
}

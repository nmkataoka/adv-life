import { NComponent } from '0-engine';
import { BoundAction } from './BoundAction';

export class GoalQueueCmpt extends NComponent {
  public nextAction?: BoundAction<any>;
}

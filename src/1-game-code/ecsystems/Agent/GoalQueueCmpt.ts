import { NComponent } from '../../../0-engine/ECS/NComponent';
import { BoundAction } from './BoundAction';

export class GoalQueueCmpt implements NComponent {
  public nextAction?: BoundAction;
}

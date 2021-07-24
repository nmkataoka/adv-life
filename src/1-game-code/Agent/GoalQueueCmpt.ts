import { NComponent } from '0-engine';
import { ProcRule } from './ProcRule';

export class GoalQueueCmpt extends NComponent {
  public nextAction?: ProcRule;
}

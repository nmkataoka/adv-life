import { NComponent } from '0-engine';
import { ProcRule } from '1-game-code/Agent/ProcRule';
import { ActionContext } from '1-game-code/Agent/ProcRules/ActionContext';

export class AgentCmpt extends NComponent {
  /**
   * Action contexts are situations which agents can be in that
   * have associated possible actions. This helps limit the number
   * of possible actions which are considered by the agent at
   * any given time.
   */
  public actionContexts: Record<string, ActionContext> = {};

  public baction?: ProcRule;
}

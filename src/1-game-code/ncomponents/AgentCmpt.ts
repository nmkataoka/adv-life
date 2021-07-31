import { NComponent } from '0-engine';
import { ProcRule } from '1-game-code/Agent/ProcRule';
import { ActionContext } from '1-game-code/Agent/ProcRules/ActionContext';

export class AgentCmpt extends NComponent {
  public actionContexts: Record<string, ActionContext> = {};

  public baction?: ProcRule;
}

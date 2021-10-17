import { NComponent } from '0-engine';
import { Consideration } from './Consideration';
import { ActionRule, RequiredProps } from './ProcRule';
import { CreateTown } from './ProcRules/CreateTown';

export class ProcRuleDbCmpt extends NComponent {
  public actions: Map<
    string,
    {
      action: ActionRule<RequiredProps, Record<string, unknown>>;
      considerations: Consideration[];
    }
  >;

  constructor() {
    super();
    this.actions = new Map();
    // Eventually this should be moved out into a data file
    // that could be managed in a data-driven way
    this.actions.set(CreateTown.name, { action: CreateTown, considerations: [] });
  }

  public getAction(name: string): ActionRule {
    const actionData = this.actions.get(name);
    if (!actionData) throw new Error(`Couldn't find action \`${name}\``);
    return actionData.action;
  }

  public getConsiderations(name: string): Consideration[] {
    const actionData = this.actions.get(name);
    if (!actionData) throw new Error(`Couldn't find action \`${name}\``);
    return actionData.considerations;
  }
}

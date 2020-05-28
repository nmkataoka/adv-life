import { ECSystem } from '../../0-engine/ECS/ECSystem';
import { GetEventSys } from '../../0-engine/ECS/globals/DispatchEvent';
import { UNIT_ATTACKED } from '../Agent/ProcRuleData/Constants';


export class CombatLogSys extends ECSystem {
  public entries: string[] = [];

  public Start(): void {
    GetEventSys().RegisterListener(UNIT_ATTACKED, this.OnUnitAttacked);
  }

  public OnUpdate(): void {}

  public OnUnitAttacked = (payload: any) => {
    const { self, target, damage } = payload;
    this.entries.push(`Unit ${self} attacked Unit ${target} for ${damage} damage.`);
  }
}

import { ECSystem } from '../../0-engine/ECS/ECSystem';
import { GetEventSys } from '../../0-engine/ECS/globals/DispatchEvent';
import { UNIT_ATTACKED, UNIT_CAST_SPELL, UNIT_CAST_HEAL } from '../Agent/ProcRuleData/Constants';


export class CombatLogSys extends ECSystem {
  public entries: string[] = [];

  public Start(): void {
    const eventSys = GetEventSys();
    eventSys.RegisterListener(UNIT_ATTACKED, this.OnUnitAttacked);
    eventSys.RegisterListener(UNIT_CAST_HEAL, this.OnUnitCastHeal);
    eventSys.RegisterListener(UNIT_CAST_SPELL, this.OnUnitCastSpell);
  }

  public OnUpdate(): void {}

  public OnUnitAttacked = (payload: any) => {
    const { self, target, damage } = payload;
    this.entries.push(`Unit ${self} attacked Unit ${target} for ${damage} damage.`);
  }

  public OnUnitCastSpell = (payload: any) => {
    const {
      self,
      targets,
      name,
      damage,
    } = payload;
    this.entries.push(
      `Unit ${self} cast ${name} and hit ${getUnitText(targets)} for ${damage} damage.`,
    );
  }

  public OnUnitCastHeal = (payload: any) => {
    const {
      self, targets, name, amount,
    } = payload;
    this.entries.push(`Unit ${self} healed ${getUnitText(targets)} with ${name} for ${amount}.`);
  }
}

function getUnitText(units: number | string | number[] | string[]): string {
  if (Array.isArray(units)) {
    if (units.length > 1) {
      let unitText = `Units ${units[0]}`;
      for (let i = 1; i < units.length; ++i) {
        unitText += `, ${units[i]}`;
      }
      return unitText;
    }

    return `Unit ${units[0]}`;
  }

  return `Unit ${units}`;
}

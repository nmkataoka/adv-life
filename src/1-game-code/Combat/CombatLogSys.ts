import { createEventListener, ECSystem } from '0-engine';
import { GetEventSys } from '0-engine/ECS/globals/DispatchEvent';
import {
  UNIT_ATTACKED,
  UNIT_CAST_SPELL,
  UNIT_CAST_HEAL,
  UNIT_CANCELED_ACTION,
} from '../Agent/ProcRuleData/Constants';

const onUnitAttackedSlice = createEventListener({})<{
  self: number;
  target: number;
  damage: number;
}>(function onUnitAttacked({ payload: { self, target, damage } }) {
  CombatLogSys.entries.push(`Unit ${self} attacked Unit ${target} for ${damage} damage.`);
});

const onUnitCastSpellSlice = createEventListener({})<{
  self: number;
  targets: number[];
  name: string;
  damage: number;
}>(function onUnitCastSpell({ payload: { self, targets, name, damage } }) {
  CombatLogSys.entries.push(
    `Unit ${self} cast ${name} and hit ${getUnitText(targets)} for ${damage} damage.`,
  );
});

const onUnitCastHealSlice = createEventListener({})<{
  self: number;
  targets: number[];
  name: string;
  amount: number;
}>(function onUnitCastHealSlice({ payload: { self, targets, name, amount } }) {
  CombatLogSys.entries.push(
    `Unit ${self} healed ${getUnitText(targets)} with ${name} for ${amount}.`,
  );
});

const onUnitCanceledActionSlice = createEventListener({})<{
  self: number;
  target: number;
  actionName: string;
  reason: string;
}>(function onUnitCanceledAction({ payload: { self, target, actionName, reason } }) {
  CombatLogSys.entries.push(
    `Unit ${self} canceled ${actionName} on ${getUnitText(target)} because: ${reason}`,
  );
});

export class CombatLogSys extends ECSystem {
  public static entries: string[] = [];

  public Start(): void {
    const eventSys = GetEventSys();
    eventSys.RegisterListener(UNIT_ATTACKED, onUnitAttackedSlice.eventListener);
    eventSys.RegisterListener(UNIT_CAST_HEAL, onUnitCastHealSlice.eventListener);
    eventSys.RegisterListener(UNIT_CAST_SPELL, onUnitCastSpellSlice.eventListener);
    eventSys.RegisterListener(UNIT_CANCELED_ACTION, onUnitCanceledActionSlice.eventListener);
  }

  public OnUpdate(): void {}
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

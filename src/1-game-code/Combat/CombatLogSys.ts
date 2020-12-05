import { createEventSlice } from '0-engine';
import {
  UNIT_ATTACKED,
  UNIT_CAST_SPELL,
  UNIT_CAST_HEAL,
  UNIT_CANCELED_ACTION,
} from '../Agent/ProcRuleData/Constants';

export const combatLog: string[] = [];

const onUnitAttackedSlice = createEventSlice(
  UNIT_ATTACKED,
  {},
)<{
  self: number;
  target: number;
  damage: number;
}>(function onUnitAttacked({ payload: { self, target, damage } }) {
  combatLog.push(`Unit ${self} attacked Unit ${target} for ${damage} damage.`);
});

const onUnitCastSpellSlice = createEventSlice(
  UNIT_CAST_SPELL,
  {},
)<{
  self: number;
  targets: number[];
  name: string;
  damage: number;
}>(function onUnitCastSpell({ payload: { self, targets, name, damage } }) {
  combatLog.push(`Unit ${self} cast ${name} and hit ${getUnitText(targets)} for ${damage} damage.`);
});

const onUnitCastHealSlice = createEventSlice(
  UNIT_CAST_HEAL,
  {},
)<{
  self: number;
  targets: number[];
  name: string;
  amount: number;
}>(function onUnitCastHealSlice({ payload: { self, targets, name, amount } }) {
  combatLog.push(`Unit ${self} healed ${getUnitText(targets)} with ${name} for ${amount}.`);
});

const onUnitCanceledActionSlice = createEventSlice(
  UNIT_CANCELED_ACTION,
  {},
)<{
  self: number;
  target: number;
  actionName: string;
  reason: string;
}>(function onUnitCanceledAction({ payload: { self, target, actionName, reason } }) {
  combatLog.push(
    `Unit ${self} canceled ${actionName} on ${getUnitText(target)} because: ${reason}`,
  );
});

export default [
  onUnitAttackedSlice.eventListener,
  onUnitCastHealSlice.eventListener,
  onUnitCastSpellSlice.eventListener,
  onUnitCanceledActionSlice.eventListener,
];

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

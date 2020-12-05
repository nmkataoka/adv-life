import { createEventSliceWithView } from '0-engine';
import { CombatStatsCmpt } from './CombatStatsCmpt';

const regenManaSlice = createEventSliceWithView('regenMana', {
  writeCmpts: [CombatStatsCmpt],
})<{ dt: number }>(({ payload: { dt }, view }) => {
  view.forEach((e: number, { writeCmpts: [combatStatsCmpt] }) => {
    const { maxMana, mana, manaRegen } = combatStatsCmpt;
    combatStatsCmpt.mana = Math.min(maxMana, mana + manaRegen * dt);
  });
});

export default [regenManaSlice.eventListener];

import { createEventSliceWithView, DefaultEvent } from '0-engine';
import { CombatPositionCmpt } from './CombatPositionCmpt';
import { MovementCmpt } from './MovementCmpt';

const moveUnitsSlice = createEventSliceWithView(DefaultEvent.Update, {
  readCmpts: [MovementCmpt],
  writeCmpts: [CombatPositionCmpt],
})<{ dt: number }>(({ payload: { dt }, view }) => {
  view.forEach((e: number, { readCmpts: [movementCmpt], writeCmpts: [combatPosCmpt] }) => {
    const { speed, destination } = movementCmpt;
    const { pos } = combatPosCmpt;
    const dir = destination.sub(pos);
    const movement = dir.multScalar(speed * dt);
    combatPosCmpt.pos.addMut(movement);
  });
});

export default [moveUnitsSlice.eventListener];

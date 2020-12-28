import { createEventSliceWithView, DefaultEvent } from '0-engine';
import { addMut, multiply, subtract } from '8-helpers/math/Vector2';
import { CombatPositionCmpt } from './CombatPositionCmpt';
import { MovementCmpt } from './MovementCmpt';

const moveUnitsSlice = createEventSliceWithView(DefaultEvent.Update, {
  readCmpts: [MovementCmpt],
  writeCmpts: [CombatPositionCmpt],
})<{ dt: number }>(({ payload: { dt }, view }) => {
  view.forEach((e: number, { readCmpts: [movementCmpt], writeCmpts: [combatPosCmpt] }) => {
    const { speed, destination } = movementCmpt;
    const { pos } = combatPosCmpt;
    const dir = subtract(destination, pos);
    const movement = multiply(dir, speed * dt);
    addMut(combatPosCmpt.pos, movement);
  });
});

export default [moveUnitsSlice.eventListener];

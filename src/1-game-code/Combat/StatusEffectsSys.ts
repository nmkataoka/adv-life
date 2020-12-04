import { createEventSliceWithView, DefaultEvent } from '0-engine';
import { StatusEffectsCmpt } from './StatusEffectsCmpt';

const updateSlice = createEventSliceWithView(DefaultEvent.Update, {
  writeCmpts: [StatusEffectsCmpt],
})<{ dt: number }>(({ payload: { dt }, view }) => {
  view.forEach((e, { writeCmpts: [statusEffectCmpt] }) => {
    statusEffectCmpt.DecreaseRemainingTimeOfStatusEffects(dt);
  });
});

export default [updateSlice.eventListener];

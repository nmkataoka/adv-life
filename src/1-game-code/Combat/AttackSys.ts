import { createEventSliceWithView, DefaultEvent, Entity } from '0-engine';
import { HealthCmpt } from '../ncomponents/HealthCmpt';

const checkForDeathsSlice = createEventSliceWithView(DefaultEvent.Update, {
  readCmpts: [HealthCmpt],
})<undefined>(function checkForDeaths({ eMgr, view }) {
  view.forEach((e: Entity, { readCmpts: [healthCmpt] }) => {
    if (healthCmpt.health <= 0) {
      eMgr.queueEntityDestruction(e);
    }
  });
});

export default [checkForDeathsSlice.eventListener];

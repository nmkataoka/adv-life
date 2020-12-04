import { createEventSliceWithView, DefaultEvent } from '0-engine';
import { HealthCmpt } from '../ncomponents/HealthCmpt';

const checkForDeathsSlice = createEventSliceWithView(DefaultEvent.Update, {
  readCmpts: [HealthCmpt],
})<undefined>(function checkForDeaths({ eMgr, view }) {
  view.forEach((e: number | string, { readCmpts: [healthCmpt] }) => {
    if (healthCmpt.health <= 0) {
      eMgr.queueEntityDestruction(e);
    }
  });
});

export default [checkForDeathsSlice.eventListener];

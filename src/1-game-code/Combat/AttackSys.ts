import { createEventListenerWithView, ECSystem } from '0-engine';
import { HealthCmpt } from '../ncomponents/HealthCmpt';

const slice = createEventListenerWithView({
  readCmpts: [HealthCmpt],
})<undefined>(function checkForDeaths({ eMgr, view }) {
  view.forEach((e: number | string, { readCmpts: [healthCmpt] }) => {
    if (healthCmpt.health <= 0) {
      eMgr.queueEntityDestruction(e);
    }
  });
});

export class AttackSys extends ECSystem {
  public Start(): void {}

  public OnUpdate(): void {
    this.checkForDeaths();
  }
}

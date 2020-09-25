import { ECSystem } from '0-engine/ECS/ECSystem';
import { EntityManager, GetView } from '0-engine';

import { HealthCmpt } from '../ncomponents/HealthCmpt';

export class AttackSys extends ECSystem {
  public Start(): void {}

  public OnUpdate(): void {
    this.checkForDeaths();
  }

  public checkForDeaths(): void {
    const eMgr = EntityManager.instance;
    const view = GetView(eMgr, 0, HealthCmpt);
    const [healthMgr] = view.cMgrs;
    for (let i = 0; i < view.Count; ++i) {
      const e = view.At(i);
      const healthCmpt = healthMgr.getMut(e);

      if (healthCmpt && healthCmpt.health <= 0) {
        eMgr.QueueEntityDestruction(parseInt(e, 10));
      }
    }
  }
}

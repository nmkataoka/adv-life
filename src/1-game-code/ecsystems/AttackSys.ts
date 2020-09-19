import { ECSystem } from '../../0-engine/ECS/ECSystem';
import { HealthCmpt } from '../ncomponents/HealthCmpt';
import { EntityManager } from '../../0-engine/ECS/EntityManager';
import { GetView } from '../../0-engine/ECS/View';

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
      const healthCmpt = healthMgr.GetByNumber(e);

      if (healthCmpt && healthCmpt.health <= 0) {
        eMgr.QueueEntityDestruction(parseInt(e, 10));
      }
    }
  }
}

import { ECSystem } from '0-engine/ECS/ECSystem';
import { EntityManager } from '0-engine';

import { HealthCmpt } from '../ncomponents/HealthCmpt';

export class AttackSys extends ECSystem {
  public Start(): void {}

  public OnUpdate(): void {
    this.checkForDeaths();
  }

  public checkForDeaths(): void {
    const eMgr = EntityManager.instance;
    const view = eMgr.getView([HealthCmpt], [], []);
    view.forEach((e: number | string, [healthCmpt]) => {
      if (healthCmpt.health <= 0) {
        eMgr.queueEntityDestruction(e);
      }
    });
  }
}

import { ECSystem } from "../0-engine/ECS/ECSystem";
import { HealthCmpt } from "../1- ncomponents/HealthCmpt";

export class AttackSys extends ECSystem {
  public Start(): void {}

  public OnUpdate(dt: number): void {
    this.checkForDeaths();
  }

  public checkForDeaths(): void {
    const { eMgr } = this;
    const healthMgr = eMgr.GetComponentManager(HealthCmpt);

    Object.entries(healthMgr.components).forEach(checkForDeath);

    function checkForDeath([e, healthCmpt]: [string, HealthCmpt]) {
      if (healthCmpt.health <= 0) {
        eMgr.QueueEntityDestruction(parseInt(e, 10));
      }
    }
  }
}

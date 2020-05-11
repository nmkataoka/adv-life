import { ECSystem } from "../0-engine/ECS/ECSystem";
import { CanAttackCmpt } from "../1- ncomponents/CanAttackCmpt";
import { WeaponCmpt } from "../1- ncomponents/WeaponCmpt";
import { HealthCmpt } from "../1- ncomponents/HealthCmpt";

export class AttackSys extends ECSystem {
  public Start(): void {}

  public OnUpdate(): void {
    this.doAttacks();
    this.checkForDeaths();
  }

  public doAttacks(): void {
    const { eMgr } = this;
    const canAttackMgr = eMgr.GetComponentManager<CanAttackCmpt, typeof CanAttackCmpt>(
      CanAttackCmpt
    );
    const weaponMgr = eMgr.GetComponentManager<WeaponCmpt, typeof WeaponCmpt>(WeaponCmpt);
    const healthMgr = eMgr.GetComponentManager<HealthCmpt, typeof HealthCmpt>(HealthCmpt);

    Object.entries(canAttackMgr.components).forEach(executeAttackIfPossible);

    function executeAttackIfPossible([, canAttackCmpt]: [string, CanAttackCmpt]) {
      if (canAttackCmpt.targetEntity) {
        const targetHandle = canAttackCmpt.targetEntity;
        const weaponCmpt = weaponMgr.GetByNumber(targetHandle);
        const targetHealthCmpt = healthMgr.GetByNumber(targetHandle);
        if (targetHealthCmpt) {
          if (weaponCmpt) {
            targetHealthCmpt.TakeDamage(weaponCmpt.damage);
          }
        } else {
          // Target is likely dead, so reset target
          canAttackCmpt.targetEntity = undefined;
        }
      }
    }
  }

  public checkForDeaths(): void {
    const { eMgr } = this;
    const healthMgr = eMgr.GetComponentManager<HealthCmpt, typeof HealthCmpt>(HealthCmpt);

    Object.entries(healthMgr.components).forEach(checkForDeath);

    function checkForDeath([e, healthCmpt]: [string, HealthCmpt]) {
      if (healthCmpt.health <= 0) {
        eMgr.QueueEntityDestruction(parseInt(e, 10));
      }
    }
  }
}

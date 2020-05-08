import { ECSystem } from "../0-engine/ECS/ECSystem";
import { GameManager } from "../0-engine/GameManager";
import { CanAttackCmpt } from "../1- ncomponents/CanAttackCmpt";
import { WeaponCmpt } from "../1- ncomponents/WeaponCmpt";
import { HealthCmpt } from "../1- ncomponents/HealthCmpt";

export class AttackSys extends ECSystem {
  public Start(): void {}

  public OnUpdate(): void {
    const { eMgr } = GameManager.instance;
    const canAttackMgr = eMgr.GetComponentManager<CanAttackCmpt, typeof CanAttackCmpt>(
      CanAttackCmpt
    );
    const weaponMgr = eMgr.GetComponentManager<WeaponCmpt, typeof WeaponCmpt>(WeaponCmpt);
    const healthMgr = eMgr.GetComponentManager<HealthCmpt, typeof HealthCmpt>(HealthCmpt);

    Object.entries(canAttackMgr.components).forEach(executeAttackIfPossible);

    function executeAttackIfPossible([e, canAttackCmpt]: [string, CanAttackCmpt]) {
      if (canAttackCmpt.targetEntity) {
        const targetHandle = parseInt(e, 10);
        const weaponCmpt = weaponMgr.GetByNumber(targetHandle);
        const targetHealthCmpt = healthMgr.GetByNumber(targetHandle);
        if (weaponCmpt && targetHealthCmpt) {
          targetHealthCmpt.TakeDamage(weaponCmpt.damage);
        }
      }
    }
  }
}

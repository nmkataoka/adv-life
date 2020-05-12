import { ECSystem } from "../0-engine/ECS/ECSystem";
import { CanAttackCmpt } from "../1- ncomponents/CanAttackCmpt";
import { WeaponCmpt } from "../1- ncomponents/WeaponCmpt";
import { HealthCmpt } from "../1- ncomponents/HealthCmpt";
import { FactionCmpt } from "../1- ncomponents/FactionCmpt";
import { ComponentManager } from "../0-engine/ECS/ComponentManager";
import { CombatPositionCmpt } from "../1- ncomponents/CombatPositionCmpt";

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
    const factionMgr = eMgr.GetComponentManager<FactionCmpt, typeof FactionCmpt>(FactionCmpt);
    const combatPositionMgr = eMgr.GetComponentManager<
      CombatPositionCmpt,
      typeof CombatPositionCmpt
    >(CombatPositionCmpt);

    Object.entries(canAttackMgr.components).forEach(executeAttackIfPossible);

    function executeAttackIfPossible([, canAttackCmpt]: [string, CanAttackCmpt]) {
      if (canAttackCmpt.skillName) {
        executeSkill(canAttackCmpt);
      }
    }

    function executeSkill(canAttackCmpt: CanAttackCmpt): void {
      console.log("executing skill", canAttackCmpt);
      function resetTargetAndSkill() {
        canAttackCmpt.targetEntities = [];
        canAttackCmpt.skillName = "";
      }

      switch (canAttackCmpt.skillName) {
        case "attack": {
          const [targetHandle] = canAttackCmpt.targetEntities;
          const weaponCmpt = weaponMgr.GetByNumber(targetHandle);
          const targetHealthCmpt = healthMgr.GetByNumber(targetHandle);
          if (targetHealthCmpt) {
            if (weaponCmpt) {
              targetHealthCmpt.TakeDamage(weaponCmpt.damage);
            }
          } else {
            // Target is likely dead, so reset target
            resetTargetAndSkill();
          }
          break;
        }

        case "fireball": {
          const fireballDmg = 30;
          const [centerTarget] = canAttackCmpt.targetEntities;
          const targetEntities = getTargetsInAoeRadius(
            centerTarget,
            1,
            factionMgr,
            combatPositionMgr
          );
          console.log("fireball, targets in aoeRadius", targetEntities);
          targetEntities.forEach((targetHandle) => {
            const targetHealthCmpt = healthMgr.GetByNumber(targetHandle);
            if (targetHealthCmpt) {
              targetHealthCmpt.TakeDamage(fireballDmg);
            }
          });
          resetTargetAndSkill();
          break;
        }

        default: {
          console.log("unrecognized skill name: " + canAttackCmpt.skillName);
          break;
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

function getTargetsInAoeRadius(
  centerTarget: number,
  aoeRadius: number,
  factionMgr: ComponentManager<FactionCmpt, typeof FactionCmpt>,
  combatPositionMgr: ComponentManager<CombatPositionCmpt, typeof CombatPositionCmpt>
): number[] {
  // Get enemies in combat order
  const enemies = Object.entries(factionMgr.components).filter((faction) => faction[1].isEnemy);
  console.log("enemies", enemies);
  const enemyPositions: EntityCombatPos[] = enemies.map((e) => {
    const entityHandle = parseInt(e[0], 10);
    const combatPos = combatPositionMgr.GetByNumber(entityHandle);
    return { entityHandle, combatPos };
  });
  console.log("enemy positions", enemyPositions);
  const sortedEnemyPositions = enemyPositions.sort(sortByCombatPos);
  console.log("sorted enemy positions", sortedEnemyPositions);

  // Get enemies within radius
  const centerIdx = sortedEnemyPositions.findIndex((e) => e.entityHandle === centerTarget);

  if (centerIdx < 0 || centerIdx > sortedEnemyPositions.length) {
    throw new Error(
      "Target was not in the enemy array. There may be an issue with CombatPositions."
    );
  }

  const targets = [centerTarget];
  for (let i = 1; i <= aoeRadius; ++i) {
    const left = sortedEnemyPositions[centerIdx - i];
    if (left) {
      targets.push(left.entityHandle);
    }
    const right = sortedEnemyPositions[centerIdx + i];
    if (right) {
      targets.push(right.entityHandle);
    }
  }
  return targets;
}

type EntityCombatPos = {
  entityHandle: number;
  combatPos?: CombatPositionCmpt;
};

function sortByCombatPos(a: EntityCombatPos, b: EntityCombatPos) {
  const aPos = a.combatPos?.position ?? -1;
  const bPos = b.combatPos?.position ?? -1;
  return aPos - bPos;
}

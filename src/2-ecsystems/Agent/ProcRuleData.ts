import { ProcRule, ExecutorStatus } from "./ProcRule";
import { GetComponent, GetComponentManager } from "../../0-engine/GlobalFunctions";
import { HealthCmpt } from "../../1- ncomponents/HealthCmpt";
import { CombatStatsCmpt } from "../../1- ncomponents/CombatStatsCmpt";
import { CombatPositionCmpt } from "../../1- ncomponents/CombatPositionCmpt";
import { FactionCmpt } from "../../1- ncomponents/FactionCmpt";
import { ComponentManager } from "../../0-engine/ECS/ComponentManager";
import { createChannelTime } from "./ProcRuleDataHelpers";

export const ProcRuleData: ProcRule<any>[] = [
  new ProcRule("attack", () => (entityBinding: number[], dt: number, data: number) => {
    const [, target] = entityBinding;
    const targetHealthCmpt = GetComponent(HealthCmpt, target);
    console.log("attacking, dmg", data, "targethealth", targetHealthCmpt);

    // If no target, attack is finished
    if (!targetHealthCmpt) return ExecutorStatus.Finished;

    const damage = data;
    targetHealthCmpt.TakeDamage(damage);
    return ExecutorStatus.Finished;
  }),

  new ProcRule("recover", () => {
    let timePassed = 0;

    return (entityBinding: number[], dt: number, data: number) => {
      timePassed += dt;
      const recoveryDuration = data;
      if (timePassed >= recoveryDuration) {
        return ExecutorStatus.Finished;
      }
      return ExecutorStatus.Running;
    };
  }),

  new ProcRule("fireball", () => {
    const channelDuration = 2;
    const channel = createChannelTime(channelDuration);

    return (entityBinding: number[], dt: number) => {
      const manaRequirement = 25;
      const damage = 30;
      const aoeRadius = 1;
      const [self, centerTarget] = entityBinding;

      // channel first
      const channelIsFinished = channel(dt);
      if(!channelIsFinished) {
        return ExecutorStatus.Running;
      }

      // check for sufficient mana
      const combatStatsCmpt = GetComponent(CombatStatsCmpt, self);
      if (!combatStatsCmpt || combatStatsCmpt.mana < manaRequirement) {
        return ExecutorStatus.Error;
      }

      // use mana
      combatStatsCmpt.mana -= manaRequirement;

      // do the fireball
      const factionMgr = GetComponentManager(FactionCmpt);
      const combatPositionMgr = GetComponentManager(CombatPositionCmpt);
      const targetEntities = getTargetsInAoeRadius(
        centerTarget,
        aoeRadius,
        factionMgr,
        combatPositionMgr
      );
      console.log("fireball, targets in aoeRadius", targetEntities);
      const healthMgr = GetComponentManager(HealthCmpt);
      targetEntities.forEach((targetHandle) => {
        const targetHealthCmpt = healthMgr.GetByNumber(targetHandle);
        if (targetHealthCmpt) {
          targetHealthCmpt.TakeDamage(damage);
        }
      });

      return ExecutorStatus.Finished;
    }
  }),
];

type EntityCombatPos = {
  entityHandle: number;
  combatPos?: CombatPositionCmpt;
};

function sortByCombatPos(a: EntityCombatPos, b: EntityCombatPos) {
  const aPos = a.combatPos?.position ?? -1;
  const bPos = b.combatPos?.position ?? -1;
  return aPos - bPos;
}

function getTargetsInAoeRadius(
  centerTarget: number,
  aoeRadius: number,
  factionMgr: ComponentManager<FactionCmpt, typeof FactionCmpt>,
  combatPositionMgr: ComponentManager<CombatPositionCmpt, typeof CombatPositionCmpt>
): number[] {
  // Get enemies in combat order
  const enemies = Object.entries(factionMgr.components).filter((faction) => faction[1].isEnemy);
  const enemyPositions: EntityCombatPos[] = enemies.map((e) => {
    const entityHandle = parseInt(e[0], 10);
    const combatPos = combatPositionMgr.GetByNumber(entityHandle);
    return { entityHandle, combatPos };
  });

  const sortedEnemyPositions = enemyPositions.sort(sortByCombatPos);

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

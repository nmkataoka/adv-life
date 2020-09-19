import { ProcRule, ExecutorStatus } from '../ProcRule';
import { GetComponent, GetComponentManager } from '../../../0-engine';
import { HealthCmpt } from '../../ncomponents/HealthCmpt';
import { CombatStatsCmpt } from '../../Combat/CombatStatsCmpt';
import { CombatPositionCmpt } from '../../Combat/CombatPositionCmpt';
import { FactionCmpt } from '../../ncomponents/FactionCmpt';
import { ComponentManager } from '../../../0-engine/ECS/ComponentManager';
import { createChannelTime } from '../ProcRuleDataHelpers';
import { UNIT_CAST_SPELL, UNIT_CANCELED_ACTION } from './Constants';
import { DispatchEvent } from '../../../0-engine/ECS/globals/DispatchEvent';

export const fireball = new ProcRule(
  'fireball',
  () => {
    const channelDuration = 2;
    const channel = createChannelTime(channelDuration);

    return (entityBinding: number[], dt: number) => {
      const manaRequirement = 35;
      const damage = 30;
      const aoeRadius = 1;
      const [self, centerTarget] = entityBinding;

      // channel first
      const channelIsFinished = channel(self, dt);
      if (!channelIsFinished) {
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
      let targetEntities;
      try {
        targetEntities = getTargetsInAoeRadius(
          centerTarget,
          aoeRadius,
          factionMgr,
          combatPositionMgr,
        );
      } catch (e) {
        DispatchEvent({
          type: UNIT_CANCELED_ACTION,
          payload: {
            self,
            target: centerTarget,
            actionName: 'fireball',
            reason: e,
          },
        });
        return ExecutorStatus.Error;
      }

      DispatchEvent({
        type: UNIT_CAST_SPELL,
        payload: {
          self,
          targets: targetEntities,
          damage,
          name: 'Fireball',
        },
      });

      const healthMgr = GetComponentManager(HealthCmpt);
      targetEntities.forEach((targetHandle) => {
        const targetHealthCmpt = healthMgr.GetByNumber(targetHandle);
        if (targetHealthCmpt) {
          targetHealthCmpt.TakeDamage(damage);
        }
      });

      return ExecutorStatus.Finished;
    };
  },
  { canTargetOthers: true },
);

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
  combatPositionMgr: ComponentManager<CombatPositionCmpt, typeof CombatPositionCmpt>,
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
    const reason = 'Target was not in the enemy array.';
    throw new Error(reason);
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
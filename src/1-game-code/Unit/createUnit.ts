import { EntityManager } from '0-engine';
import { HealthCmpt } from '../ncomponents/HealthCmpt';
import {
  AgentCmpt,
  CanAttackCmpt,
  CombatPositionCmpt,
  CombatStatsCmpt,
  FactionCmpt,
  InventoryCmpt,
} from '../ncomponents';
import { StatusEffectsCmpt } from '../Combat/StatusEffectsCmpt';

import { GoalQueueCmpt } from '../Agent/GoalQueueCmpt';

export const createUnit = (position: number, isEnemy = false): number => {
  const eMgr = EntityManager.instance;
  const e = eMgr.CreateEntity();
  eMgr.AddComponent(e, HealthCmpt);
  eMgr.AddComponent(e, CombatStatsCmpt);
  eMgr.AddComponent(e, CanAttackCmpt);
  eMgr.AddComponent(e, InventoryCmpt, 1);
  eMgr.AddComponent(e, AgentCmpt);
  eMgr.AddComponent(e, StatusEffectsCmpt);
  if (!isEnemy) {
    eMgr.AddComponent(e, GoalQueueCmpt);
  }

  const combatPos = eMgr.AddComponent(e, CombatPositionCmpt);
  combatPos.position = position;

  const faction = eMgr.AddComponent(e, FactionCmpt);
  faction.isEnemy = isEnemy;

  return e;
};

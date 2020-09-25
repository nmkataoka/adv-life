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
  const e = eMgr.createEntity();
  eMgr.addCmpt(e, HealthCmpt);
  eMgr.addCmpt(e, CombatStatsCmpt);
  eMgr.addCmpt(e, CanAttackCmpt);
  eMgr.addCmpt(e, InventoryCmpt, 1);
  eMgr.addCmpt(e, AgentCmpt);
  eMgr.addCmpt(e, StatusEffectsCmpt);
  if (!isEnemy) {
    eMgr.addCmpt(e, GoalQueueCmpt);
  }

  const combatPos = eMgr.addCmpt(e, CombatPositionCmpt);
  combatPos.position = position;

  const faction = eMgr.addCmpt(e, FactionCmpt);
  faction.isEnemy = isEnemy;

  return e;
};

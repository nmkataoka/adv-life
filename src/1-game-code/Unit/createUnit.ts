import { EntityManager } from '../../0-engine';
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
  eMgr.AddComponent(e, new HealthCmpt());
  eMgr.AddComponent(e, new CombatStatsCmpt());
  eMgr.AddComponent(e, new CanAttackCmpt());
  eMgr.AddComponent(e, new InventoryCmpt(1));
  eMgr.AddComponent(e, new AgentCmpt());
  eMgr.AddComponent(e, new StatusEffectsCmpt());
  if (!isEnemy) {
    eMgr.AddComponent(e, new GoalQueueCmpt());
  }
  const combatPos = new CombatPositionCmpt();
  combatPos.position = position;
  eMgr.AddComponent(e, combatPos);
  const faction = new FactionCmpt();
  faction.isEnemy = isEnemy;
  eMgr.AddComponent(e, faction);

  return e;
};

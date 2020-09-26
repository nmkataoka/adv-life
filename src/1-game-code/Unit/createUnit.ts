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
  eMgr.addCmpt(e, new HealthCmpt());
  eMgr.addCmpt(e, new CombatStatsCmpt());
  eMgr.addCmpt(e, new CanAttackCmpt());
  const inventoryCmpt = new InventoryCmpt(1);
  eMgr.addCmpt(e, inventoryCmpt);
  eMgr.addCmpt(e, new AgentCmpt());
  eMgr.addCmpt(e, new StatusEffectsCmpt());
  if (!isEnemy) {
    eMgr.addCmpt(e, new GoalQueueCmpt());
  }

  const combatPos = new CombatPositionCmpt();
  combatPos.position = position;
  eMgr.addCmpt(e, combatPos);

  const faction = new FactionCmpt();
  faction.isEnemy = isEnemy;
  eMgr.addCmpt(e, faction);

  return e;
};

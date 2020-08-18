import { EntityManager } from '../../0-engine/ECS/EntityManager';
import { HealthCmpt } from '../../1-ncomponents/HealthCmpt';
import {
  AgentCmpt,
  CanAttackCmpt,
  CombatPositionCmpt,
  CombatStatsCmpt,
  FactionCmpt,
  InventoryCmpt,
  StatusEffectsCmpt,
} from '../../1-ncomponents';
import { Entity } from '../../0-engine/ECS/Entity';
import { GoalQueueCmpt } from '../Agent/GoalQueueCmpt';

export const createUnit = (position: number, isEnemy = false): Entity => {
  const eMgr = EntityManager.instance;
  const e = eMgr.CreateEntity();
  eMgr.AddComponent(e, new HealthCmpt());
  eMgr.AddComponent(e, new CombatStatsCmpt());
  eMgr.AddComponent(e, new CanAttackCmpt());
  eMgr.AddComponent(e, new InventoryCmpt());
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

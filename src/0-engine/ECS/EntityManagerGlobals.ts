import { EntityManager } from './EntityManager';
import { ProcRuleDbCmpt } from '../../2-ecsystems/Agent/ProcRuleDatabaseCmpt';

// These functions are separate from the EntityManager file
// in order to reduce dependencies in EntityManager.ts

export function GetPrdb(): ProcRuleDbCmpt {
  const prdbMgr = EntityManager.instance.GetComponentManager(ProcRuleDbCmpt);
  const prdb = Object.values(prdbMgr.components)[0];
  return prdb;
}

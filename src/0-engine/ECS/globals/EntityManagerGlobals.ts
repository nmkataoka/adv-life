import { ProcRuleDbCmpt } from '1-game-code/Agent/ProcRuleDatabaseCmpt';
import { EntityManager } from '../EntityManager';

// These functions are separate from the EntityManager file
// in order to reduce dependencies in EntityManager.ts

export function GetPrdb(): ProcRuleDbCmpt {
  const prdbMgr = EntityManager.instance.tryGetMgrMut(ProcRuleDbCmpt);
  const prdb = Object.values(prdbMgr.components)[0];
  return prdb;
}

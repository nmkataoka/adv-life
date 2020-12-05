import { BoundAction } from '1-game-code/Agent/BoundAction';
import { GoalQueueCmpt } from '1-game-code/Agent/GoalQueueCmpt';
import { EntityManager } from '0-engine';
import { ProcRuleDbCmpt } from '1-game-code/Agent/ProcRuleDatabaseCmpt';
import { getSkillData } from '../SkillData';

export function setSkillTarget(user: number, targets: number[], skillName: string): void {
  const prdb = EntityManager.instance.getUniqueCmptMut(ProcRuleDbCmpt);

  const procRule = prdb.getProcRule(skillName);
  const entityBinding = [user, ...targets];
  const { data, recoveryDuration } = getSkillData(user, targets, skillName);
  const baction = new BoundAction(procRule, entityBinding, data, recoveryDuration);

  const goalQueueCmpt = EntityManager.instance.tryGetCmptMut(GoalQueueCmpt, user);
  if (goalQueueCmpt) {
    goalQueueCmpt.nextAction = baction;
  }
}

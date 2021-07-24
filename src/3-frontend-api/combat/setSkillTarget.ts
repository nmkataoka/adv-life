import { GoalQueueCmpt } from '1-game-code/Agent/GoalQueueCmpt';
import { EntityManager } from '0-engine';
import { ProcRuleDbCmpt } from '1-game-code/Agent/ProcRuleDatabaseCmpt';

export function setSkillTarget(user: number, targets: number[], skillName: string): void {
  const prdb = EntityManager.instance.getUniqueCmptMut(ProcRuleDbCmpt);

  const P = prdb.getProcRule(skillName);
  const entityBinding = [user, ...targets];
  const baction = new P(entityBinding);

  const goalQueueCmpt = EntityManager.instance.tryGetCmptMut(GoalQueueCmpt, user);
  if (goalQueueCmpt) {
    goalQueueCmpt.nextAction = baction;
  }
}

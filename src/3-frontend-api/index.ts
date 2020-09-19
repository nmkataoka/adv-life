import { BoundAction } from '../1-game-code/Agent/BoundAction';
import { GoalQueueCmpt } from '../1-game-code/Agent/GoalQueueCmpt';
import { getSkillData } from './SkillData';
import { EntityManager } from '../0-engine';
import { GetPrdb } from '../0-engine/ECS/globals/EntityManagerGlobals';

export function SetSkillTarget(user: number, targets: number[], skillName: string): void {
  const prdb = GetPrdb();

  const procRule = prdb.getProcRule(skillName);
  const entityBinding = [user, ...targets];
  const { data, recoveryDuration } = getSkillData(user, targets, skillName);
  const baction = new BoundAction(procRule, entityBinding, data, recoveryDuration);

  const goalQueueCmpt = EntityManager.instance.GetComponentUncertain(GoalQueueCmpt, user);
  if (goalQueueCmpt) {
    goalQueueCmpt.nextAction = baction;
  }
}

import { BoundAction } from '../2-ecsystems/Agent/BoundAction';
import { GoalQueueCmpt } from '../2-ecsystems/Agent/GoalQueueCmpt';
import { getSkillData } from './SkillData';
import { EntityManager } from '../0-engine/ECS/EntityManager';
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

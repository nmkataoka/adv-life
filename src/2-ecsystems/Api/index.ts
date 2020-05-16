import { GetComponent, GetComponentManager } from "../../0-engine/GlobalFunctions";
import { BoundAction } from "../Agent/BoundAction";
import { GoalQueueCmpt } from "../Agent/GoalQueueCmpt";
import { CombatStatsCmpt } from "../../1- ncomponents/CombatStatsCmpt";
import { ProcRuleDbCmpt } from "../Agent/ProcRuleDatabaseCmpt";

export function SetSkillTarget(user: number, targets: number[], skillName: string) {
  const prdb = Object.values(GetComponentManager(ProcRuleDbCmpt).components)[0]

  const procRule = prdb.getProcRule(skillName);
  const entityBinding = [user, ...targets];
  const { data, recoveryDuration } = getSkillData(user, targets, skillName);
  const baction = new BoundAction(procRule, entityBinding, data, recoveryDuration);

  const goalQueueCmpt = GetComponent(GoalQueueCmpt, user);
  if(goalQueueCmpt) {
    goalQueueCmpt.nextAction = baction;
  }
}

function getSkillData(user: number, targets: number[], skillName: string) {
  let data: any = undefined;
  const recoveryDuration = getRecoveryDuration(user);

  switch(skillName) {
    case "attack": {
      data = 15;
      break;
    }
    case "recover": {
      data = recoveryDuration;
      break;
    }
    case "fireball": {
      break;
    }
    default:
      break;
  }

  return { data, recoveryDuration };
}

function getRecoveryDuration(user: number) {
  const defaultRecoveryPeriod = 2;
  const combatStatsCmpt = GetComponent(CombatStatsCmpt, user);
  const recoveryDuration = combatStatsCmpt?.getAttackCooldown() ?? defaultRecoveryPeriod;
  return recoveryDuration;
}
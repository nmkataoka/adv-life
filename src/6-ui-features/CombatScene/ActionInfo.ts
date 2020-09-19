import { ProcRuleData } from '../../1-game-code/Agent/ProcRuleData';

export type ActionInfo = {
  name: string;
  displayText: string;
  aoeRadius: number;
  canTargetOthers: boolean;
};

const defaultActionInfo = {
  name: 'MISSING NAME',
  displayText: 'MISSING TEXT',
  aoeRadius: 0,
  canTargetOthers: false,
};

export function CreateActionInfo(data: Partial<ActionInfo>): ActionInfo {
  if (!data.name) throw new Error('Action Info must have a name');

  let actionInfo;

  const procRule = ProcRuleData[data.name];
  if (procRule) {
    const { canTargetOthers } = procRule;
    actionInfo = { ...defaultActionInfo, canTargetOthers, ...data };
  } else {
    actionInfo = { ...defaultActionInfo, ...data };
  }

  return actionInfo;
}

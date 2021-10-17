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

  const actionInfo = { ...defaultActionInfo, ...data };

  return actionInfo;
}

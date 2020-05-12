export type ActionInfo = {
  name: string;
  displayText: string;
  aoeRadius: number;
};

const defaultActionInfo = {
  name: "MISSING NAME",
  displayText: "MISSING TEXT",
  aoeRadius: 0,
};

export function CreateActionInfo(data?: Partial<ActionInfo>): ActionInfo {
  return { ...defaultActionInfo, ...data };
}

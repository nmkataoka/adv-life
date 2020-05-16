import { ProcRule, ProcRuleExecutor } from "./ProcRule";

export enum BoundActionStatus {
  Prospective = 0,
  Active,
  Finished,
}

export class BoundAction<ExecDataType = void> {
  public static Idle = (self: number) => new BoundAction(ProcRule.Idle(), [self], undefined);

  public status: BoundActionStatus;
  public procRule: ProcRule<ExecDataType>;
  public entityBinding: number[];
  public data: ExecDataType;

  // After the action is successfully executed,
  // a non-zero recoveryDuration will force the agent
  // to wait before choosing a new action.
  // This is useful for combat and also to slow down the simulation for debugging or optimization
  public recoveryDuration: number;

  constructor(procRule: ProcRule<ExecDataType>, entityBinding: number[], data: ExecDataType, recoveryDuration = 0) {
    this.entityBinding = entityBinding;
    this.procRule = procRule;
    this.status = BoundActionStatus.Prospective;
    this.data = data;
    this.recoveryDuration = recoveryDuration;

    this.exec = procRule.GenerateExecutor();
  }

  public Continue(dt: number): number {
    return this.exec(this.entityBinding, dt, this.data);
  }

  private exec: ProcRuleExecutor<ExecDataType>;
}

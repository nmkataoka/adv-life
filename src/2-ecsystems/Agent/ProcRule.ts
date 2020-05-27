// Returns 1 if action is finished
// Returns 0 on standard success
// Returns -1 on fatal error
export type ProcRuleExecutor<DataType> = (
  entityBinding: number[],
  dt: number,
  data: DataType
) => ExecutorStatus;

// Takes closures instead of functions so the functions can own state
export type ProcRuleExecutorFactory<D> = () => ProcRuleExecutor<D>;

export enum ExecutorStatus {
  Running,
  Error,
  Finished,
}

// A template for an action.
// When an Agent wants to use a ProcRule, it instantiates a BoundAction
// from the ProcRule, adding relevant state
export class ProcRule<ExecDataType = void> {
  public static readonly Nothing = Number.MAX_SAFE_INTEGER;

  public static Idle() {
    return new ProcRule('idle', () => {
      const idleTime = 1;
      let timePassed = 0;
      return (entityBinding: number[], dt: number) => {
        timePassed += dt;
        if (timePassed > idleTime) {
          return ExecutorStatus.Finished;
        }
        return ExecutorStatus.Running;
      };
    });
  }

  public executorFac: ProcRuleExecutorFactory<ExecDataType>;

  public name: string;

  // If the action can target other entities, set to true
  public canTargetOthers = false;

  constructor(
    name: string,
    executorFac: ProcRuleExecutorFactory<ExecDataType>,
    data?: Partial<ProcRule<ExecDataType>>,
  ) {
    Object.assign(this, data);
    this.executorFac = executorFac;
    this.name = name;
  }

  public GenerateExecutor(): ProcRuleExecutor<ExecDataType> {
    return this.executorFac();
  }
}

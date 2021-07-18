type ValueOrPromise<T> = Promise<T> | T;

interface RequiredProps {
  dt: number;
  entityBinding: number[];
}

// Returns 1 if action is finished
// Returns 0 on standard success
// Returns -1 on fatal error
type ProcRuleStarter<Props, State> = (
  props: Props,
) => ValueOrPromise<{ status: ExecutorStatus; state: State }>;

export type ProcRuleTick<Props, State> = (
  props: Props,
  state: State,
) => ValueOrPromise<{ status: ExecutorStatus; state: State }>;

type ProcRuleTerminator<Props, State> = (
  props: Props,
  state: State,
) => ValueOrPromise<{ status: ExecutorStatus }>;

export enum ExecutorStatus {
  Running,
  Error,
  Finished,
}

// A template for an action.
// When an Agent wants to use a ProcRule, it instantiates a BoundAction
// from the ProcRule, adding relevant state
export class ProcRule<Props extends RequiredProps, State> {
  public static readonly Nothing = Number.MAX_SAFE_INTEGER;

  public static Idle(): ProcRule {
    return new ProcRule(
      'idle',
      () => ({ status: ExecutorStatus.Running, state: { idleTime: 1, timePassed: 0 } }),
      ({ dt }: RequiredProps, { idleTime, timePassed }) => {
        timePassed += dt;
        const newState = { idleTime, timePassed };
        if (timePassed > idleTime) {
          return { status: ExecutorStatus.Finished, state: newState };
        }
        return { status: ExecutorStatus.Running, state: newState };
      },
    );
  }

  public execute: ProcRuleStarter<Props, State>;

  public tick?: ProcRuleTick<Props, State>;

  public terminate?: ProcRuleTerminator<Props, State>;

  public name: string;

  constructor(
    name: string,
    execute: ProcRuleStarter<Props, State>,
    tick?: ProcRuleTick<Props, State>,
    terminate?: ProcRuleTerminator<Props, State>,
  ) {
    this.name = name;
    this.execute = execute;
    this.tick = tick;
    this.terminate = terminate;
  }
}

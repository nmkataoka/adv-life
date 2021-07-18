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

/**
 * A template for an action.
 * When an Agent wants to use a ProcRule, it instantiates a BoundAction
 * from the ProcRule, adding relevant state
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class ProcRule<Props extends RequiredProps, State extends object> {
  public static readonly Nothing = Number.MAX_SAFE_INTEGER;

  // public static Idle(): ProcRule<RequiredProps, { idleTime: number; timePassed: number }> {
  //   return new ProcRule(
  //     'idle',
  //     () => ({ status: ExecutorStatus.Running, state: { idleTime: 1, timePassed: 0 } }),
  //     ({ dt }: RequiredProps, { idleTime, timePassed }) => {
  //       timePassed += dt;
  //       const newState = { idleTime, timePassed };
  //       if (timePassed > idleTime) {
  //         return { status: ExecutorStatus.Finished, state: newState };
  //       }
  //       return { status: ExecutorStatus.Running, state: newState };
  //     },
  //   );
  // }

  /** Called at the start of running the ProcRule. */
  public abstract init?(props: Props): ProcRuleStarter<Props, State>;

  /**
   * If execute returns Status.Running, tick will be called on that frame and on each frame
   * after until it returns Success or Failure.
   */
  public abstract tick?: ProcRuleTick<Props, State>;

  /**
   * Called after execute and tick. Can also be called to abort tick early.
   */
  public abstract terminate?: ProcRuleTerminator<Props, State>;

  public state: State = {} as State;
}

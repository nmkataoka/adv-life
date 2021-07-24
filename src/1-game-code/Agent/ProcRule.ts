import { Entity } from '0-engine';

type ValueOrPromise<T> = Promise<T> | T;

interface RequiredProps {
  dt: number;
  entityBinding: number[];
}

export enum ExecutorStatus {
  Running,
  Error,
  Success,
}

/**
 * A template for an action.
 * When an Agent wants to use an Action, it instantiates an action, creating a BoundAction.
 */
export class ProcRule<
  Props extends RequiredProps = RequiredProps & Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  State extends object = Record<string, unknown>,
> {
  /** Constructing the action creates a bound action */
  constructor(entityBinding: Entity[]) {
    this.entityBinding = entityBinding;
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */

  /**
   * Called at the start of running the ProcRule.
   * @returns 1 if action is finished, 0 on running with no issue, -1 on fatal error
   */
  public init(props: Props): ValueOrPromise<{ status: ExecutorStatus; state: State }> {
    return { status: ExecutorStatus.Success, state: {} as State };
  }

  /**
   * If execute returns Status.Running, tick will be called on that frame and on each frame
   * after until it returns Success or Failure.
   */
  public tick(
    props: Props,
    state: State,
  ): ValueOrPromise<{ status: ExecutorStatus; state: State }> {
    return { status: ExecutorStatus.Success, state };
  }

  /**
   * Called after execute and tick. Can also be called to abort tick early.
   */
  public terminate(props: Props, state: State): ValueOrPromise<{ status: ExecutorStatus }> {
    return { status: ExecutorStatus.Success };
  }

  /* eslint-enable @typescript-eslint/no-unused-vars */

  /** @internal State to be used during the course of the action */
  state: State = {} as State;

  /** @internal */
  entityBinding: Entity[];
}

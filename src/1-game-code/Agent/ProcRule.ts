import { Entity, EntityManager } from '0-engine';
import { Dispatch } from '0-engine/ECS/event-system';
import ConditionSet from './ConditionSet/ConditionSet';

type ValueOrPromise<T> = Promise<T> | T;

export interface RequiredProps {
  dt: number;
  dispatch: Dispatch;
  eMgr: EntityManager;
  entityBinding: number[];
  [key: string]: unknown;
}

export enum ExecutorStatus {
  Running,
  Error,
  Success,
}

export type DefaultState = Record<string, unknown>;

export type InitReturn<State = DefaultState> = ValueOrPromise<{
  status: ExecutorStatus;
  state: State;
}>;
export type TickReturn<State = DefaultState> = ValueOrPromise<{
  status: ExecutorStatus;
  state: State;
}>;
export type TerminateReturn = ValueOrPromise<{ status: ExecutorStatus }>;

/**
 * A template for an action.
 * When an Agent wants to use an Action, it instantiates an action, creating a BoundAction.
 */
export class ProcRule<
  Props extends RequiredProps = RequiredProps,
  // eslint-disable-next-line @typescript-eslint/ban-types
  State extends DefaultState = DefaultState,
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
  public init(props: Props): InitReturn<State> {
    return { status: ExecutorStatus.Success, state: {} as State };
  }

  /**
   * If execute returns Status.Running, tick will be called on that frame and on each frame
   * after until it returns Success or Failure.
   */
  public tick(props: Props, state: State): TickReturn<State> {
    return { status: ExecutorStatus.Success, state };
  }

  /**
   * Called after execute and tick. Can also be called to abort tick early.
   */
  public terminate(props: Props, state: State): TerminateReturn {
    return { status: ExecutorStatus.Success };
  }

  /** Conditions for a valid entity binding. By default, no targets and just has [self]. */
  public static conditions: ConditionSet = new ConditionSet(1, { entityTemplates: [] });

  /* eslint-enable @typescript-eslint/no-unused-vars */

  /** @internal State to be used during the course of the action */
  state: State = {} as State;

  /** @internal */
  entityBinding: Entity[];
}

export type ActionRule<
  Props extends RequiredProps = RequiredProps,
  // eslint-disable-next-line @typescript-eslint/ban-types
  State extends DefaultState = DefaultState,
> = {
  new (entityBinding: Entity[]): ProcRule<Props, State>;
  conditions: ConditionSet;
  name: string;
};

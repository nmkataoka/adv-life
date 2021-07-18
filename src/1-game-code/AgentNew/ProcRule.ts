export const Status = {
  Running: 0,
  Failure: 1,
  Success: 2,
} as const;

export type StatusVal = typeof Status[keyof typeof Status];

type Executor = (entityBinding: number[], data: Data) => StatusVal;

const isFirstExecute = true;
const actionStates: Map<number, unknown[]> = new Map();
const actionId = 0;
const states: unknown[] = [];
let stateIdx = 0;
const useState = <T>(initialValue: T | (() => T)) => {
  if (isFirstExecute) {
    if (typeof initialValue === 'function') {
      initialValue = (initialValue as () => T)();
    }
    states[stateIdx] = initialValue;
  }
  const state = states[stateIdx] as T;
  const setState = (newState: T) => {
    states[stateIdx] = newState;
  };
  ++stateIdx;
  return [state, setState];
};

interface ProcRule {
  /**
   * Called at the start of running the ProcRule. Single frame actions can put all
   * their logic in here.
   */
  execute: () => StatusVal;

  /**
   * If execute returns Status.Running, tick will be called on that frame and on each frame
   * after until it returns Success or Failure.
   */
  tick: () => StatusVal;

  /**
   * Called after execute and tick. Can also be called to abort tick early.
   */
  terminate: () => StatusVal;
}

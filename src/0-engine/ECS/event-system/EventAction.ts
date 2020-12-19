type PromiseMeta = {
  resolve: (value?: void) => void;
  reject: (reason?: any) => void;
};

export type EventAction<T> = {
  type: string;
  payload: T;
};

export type EventActionWithPromise<T> = EventAction<T> & {
  promise: PromiseMeta;
};

/**
 * An Action type which accepts any other properties.
 * This is mainly for the use of the `Reducer` type.
 * This is not part of `Action` itself to prevent types that extend `Action` from
 * having an index signature.
 */
export interface AnyEventAction extends EventAction<any> {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}

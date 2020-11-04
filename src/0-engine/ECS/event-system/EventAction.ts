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

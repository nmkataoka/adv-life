import { AckCallback } from './AckCallback';

export type EventAction<T> = {
  type: string;
  payload: T;
  ack?: AckCallback<any>;
};

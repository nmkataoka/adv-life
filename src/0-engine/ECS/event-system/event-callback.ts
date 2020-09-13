import { EntityManager } from '../EntityManager';

export type AckCallback<Data> = (data: Data) => void;

export type EventCallbackArgs<Payload> = {
  eMgr: EntityManager;
  payload: Payload;
  ack: AckCallback<any>;
};

export type EventCallback<Payload> = (args: EventCallbackArgs<Payload>) => void;

import { EntityManager } from '../EntityManager';

export type AckCallback = (data: any) => void;

export type EventCallbackArgs<Payload> = {
  eMgr: EntityManager;
  payload: Payload;
  ack?: AckCallback;
};

export type EventCallback<Payload> = (args: EventCallbackArgs<Payload>) => void;

import { EntityManager } from '../EntityManager';
import { AckCallback } from './AckCallback';

export type EventCallbackArgs<Payload> = {
  eMgr: EntityManager;
  payload: Payload;
  ack: AckCallback<any>;
};

export type EventCallback<Payload> = (args: EventCallbackArgs<Payload>) => void;

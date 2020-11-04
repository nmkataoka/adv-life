import { EntityManager } from '../EntityManager';

export type EventCallbackArgs<Payload> = {
  eMgr: EntityManager;
  payload: Payload;
};

export type EventCallback<Payload> = (args: EventCallbackArgs<Payload>) => Promise<void>;

export type EventCallbackError = {
  message: string;
};

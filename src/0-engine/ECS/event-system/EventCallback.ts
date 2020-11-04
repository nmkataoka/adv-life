import { EntityManager } from '../EntityManager';

export type EventCallbackArgs<Payload> = {
  eMgr: EntityManager;
  payload: Payload;
};

export type EventCallback<Payload> = (args: EventCallbackArgs<Payload>) => Promise<void> | void;

export class EventCallbackError {
  constructor(message: string) {
    this.message = message;
  }

  public message: string;
}

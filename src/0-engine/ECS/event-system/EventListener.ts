import { EventCallback } from './EventCallback';

export class EventListener<Payload> {
  public callback: EventCallback<Payload>;

  public active: boolean;

  constructor(callback: EventCallback<Payload>) {
    this.active = true;
    this.callback = callback;
  }
}

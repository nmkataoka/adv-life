import { DispatchEvent } from '../0-engine/ECS/globals/DispatchEvent';

export type AckCallback = (data: any) => void;

/*
    Intended to be easily upgradable to WebSockets if we want to use server-client architecture.
    API inspired by Socket.io
*/
class ApiClient {
  public emit<T>(eventName: string, payload?: T, ack?: AckCallback): ApiClient {
    DispatchEvent({ type: eventName, payload, callback: ack }, true);
    return this;
  }

  /*
    Frontend may register listeners to events that the backend sends
     Only one function may be registered per event
  */
  public on = (eventName: string, callback: AckCallback): ApiClient => {
    if (this.callbacks[eventName]) {
      throw new Error('Only one callback may be registered per event.');
    }
    this.callbacks[eventName] = callback;
    return this;
  }

  private callbacks: {[key: string]: AckCallback} = {}
}

const apiClient = new ApiClient();
export default apiClient;

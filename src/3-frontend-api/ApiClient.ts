import { DispatchEvent } from '../0-engine/ECS/globals/DispatchEvent';

export type AckCallback = (data: any) => void;

/*
    Intended to be easily upgradable to WebSockets if we want to use server-client architecture.
    API inspired by Socket.io
*/
class ApiClient {
  public emit<T>(eventName: string, payload?: T, ack?: AckCallback): ApiClient {
    DispatchEvent(
      {
        type: eventName,
        payload,
        headers: this.headers,
        callback: ack,
      },
      true
    );
    return this;
  }

  /*
    Frontend may register listeners to events that the backend sends.
    Only one function may be registered per event. Mimicks listening
    to a WebSocket conneciton.
  */
  public on = (eventName: string, callback: AckCallback): ApiClient => {
    if (this.callbacks[eventName]) {
      throw new Error('Only one callback may be registered per event.');
    }
    this.callbacks[eventName] = callback;
    return this;
  };

  // Listeners to message sent from the server
  private callbacks: { [key: string]: AckCallback } = {};

  // Info sent on every event emission, e.g. user info
  private headers: { userId: number } = { userId: -1 };
}

const apiClient = new ApiClient();
export default apiClient;

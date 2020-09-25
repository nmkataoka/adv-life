import { GameManager } from '0-engine/GameManager';

export type AckCallback = (data: any) => void;

type Headers = {
  userId: number;
};

/*
    Intended to be easily upgradable to WebSockets if we want to use server-client architecture.
    API inspired by Socket.io
*/
class ApiClient {
  public emit<T>(eventName: string, payload?: T, ack?: AckCallback): ApiClient {
    GameManager.instance.dispatch(eventName, { headers: this.headers, payload, ack });
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

  public setHeader = <Key extends keyof Headers>(header: Key, value: Headers[Key]) => {
    this.headers[header] = value;
  };

  // Listeners to message sent from the server
  private callbacks: { [key: string]: AckCallback } = {};

  // Info sent on every event emission, e.g. user info
  private headers: { userId: number } = { userId: -1 };
}

const apiClient = new ApiClient();
export default apiClient;

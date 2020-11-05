import { EventCallbackError } from '0-engine/ECS/event-system/EventCallback';
import { GameManager } from '0-engine/GameManager';
import { Selector } from '4-react-ecsal';
import { DeepReadonly } from 'ts-essentials';

type Headers = {
  userId: number;
};

/*
    Intended to be easily upgradable to WebSockets if we want to use server-client architecture.
    API inspired by Socket.io
*/
class ApiClient {
  public async emit<T>(eventName: string, payload?: T): Promise<any> {
    try {
      const result = await GameManager.instance.dispatch(eventName, {
        headers: this.headers,
        payload,
      });
      return result;
    } catch (err) {
      const errors = err as EventCallbackError[];
      // eslint-disable-next-line no-console
      console.error(`Api error: ${errors.map((error) => error.message).join('\n')}`);
      return Promise.reject(errors);
    }
  }

  public get<T>(selector: Selector<T>): DeepReadonly<T> {
    return selector(GameManager.instance.eMgr);
  }

  /*
    Frontend may register listeners to events that the backend sends.
    Only one function may be registered per event. Mimicks listening
    to a WebSocket conneciton.
  */
  // public on = (eventName: string, callback: AckCallback): ApiClient => {
  //   if (this.callbacks[eventName]) {
  //     throw new Error('Only one callback may be registered per event.');
  //   }
  //   this.callbacks[eventName] = callback;
  //   return this;
  // };

  public setHeader = <Key extends keyof Headers>(header: Key, value: Headers[Key]) => {
    this.headers[header] = value;
  };

  // Listeners to message sent from the server
  // private callbacks: { [key: string]: AckCallback } = {};

  // Info sent on every event emission, e.g. user info
  private headers: { userId: number } = { userId: -1 };
}

const apiClient = new ApiClient();
export default apiClient;

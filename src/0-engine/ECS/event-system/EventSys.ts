import { ECSystem } from '../ECSystem';
import { EntityManager } from '../EntityManager';
import { EventAction } from './EventAction';
import { EventCallback } from './EventCallback';
import { EventListener } from './EventListener';

export class EventSys extends ECSystem {
  constructor(eMgr: EntityManager) {
    super(eMgr);
    this.eventListeners = {};
    this.lowPriorityEventQueue = [];
  }

  public Start(): void {}

  public OnUpdate = (): void => {
    this.ExecuteLowPriorityActions();
  };

  // Low priority actions are deferred in a queue to be executed after the current tick finishes.
  // High priority actions are dispatched immediately.
  // All actions coming from the frontend should be low priority.
  public Dispatch = <T>(action: EventAction<T>, isLowPriority = false): void => {
    if (isLowPriority) {
      this.lowPriorityEventQueue.push(action);
    } else {
      this.InternalDispatch(action);
    }
  };

  private ExecuteLowPriorityActions = (): void => {
    this.lowPriorityEventQueue.forEach((action) => {
      this.InternalDispatch(action);
    });
    this.lowPriorityEventQueue = [];
  };

  // Returns a token that can be used to deregister a listener
  public RegisterListener = <Payload>(
    eventName: string,
    callback: EventCallback<Payload>,
  ): number => {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }

    this.eventListeners[eventName].push(new EventListener(callback));
    return this.eventListeners[eventName].length - 1;
  };

  public RemoveListener = (eventName: string, token: number): void => {
    const listeners = this.eventListeners[eventName];
    if (listeners) {
      const listener = listeners[token];
      if (listener) {
        listener.active = false;
      }
    }
  };

  private InternalDispatch = <T>({ ack = () => {}, payload, type }: EventAction<T>) => {
    const listeners = this.eventListeners[type];
    if (listeners) {
      listeners.forEach((l) => {
        if (l.active) {
          l.callback({ ack, eMgr: this.eMgr, payload });
        }
      });
    }
  };

  private eventListeners: { [key: string]: EventListener<any>[] };

  private lowPriorityEventQueue: EventAction<any>[];
}

import { ECSystem } from './ECSystem';
import {
  GetComponentFuncType,
  GetComponentManagerFuncType,
  GetComponentUncertainFuncType,
} from './types/EntityManagerAccessorTypes';

export type AckCallback = (data: any) => void;
export type EventCallback = (payload: any, ackCallback?: AckCallback) => void;

export class EventListener {
  public callback: EventCallback;

  public active: boolean;

  constructor(callback: EventCallback) {
    this.active = true;
    this.callback = callback;
  }
}

export type EventAction<T> = {
  type: string;
  payload: T;
  callback?: AckCallback;
}

export class EventSys extends ECSystem {
  constructor(
    getComponent: GetComponentFuncType,
    getComponentManager: GetComponentManagerFuncType,
    getComponentUncertain: GetComponentUncertainFuncType,
  ) {
    super(getComponent, getComponentManager, getComponentUncertain);
    this.eventListeners = {};
    this.lowPriorityEventQueue = [];
  }

  public Start(): void {}

  public OnUpdate(): void {
    this.ExecuteLowPriorityActions();
  }

  // Low priority actions are deferred in a queue to be executed after the current tick finishes.
  // High priority actions are dispatched immediately.
  // All actions coming from the frontend should be low priority.
  public Dispatch<T>(action: EventAction<T>, isLowPriority = false): void {
    if (isLowPriority) {
      this.lowPriorityEventQueue.push(action);
    } else {
      this.InternalDispatch(action);
    }
  }

  public ExecuteLowPriorityActions(): void {
    this.lowPriorityEventQueue.forEach((action) => {
      this.InternalDispatch(action);
    });
    this.lowPriorityEventQueue = [];
  }

  // Returns a token that can be used to deregister a listener
  public RegisterListener(eventName: string, callback: EventCallback): number {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }

    this.eventListeners[eventName].push(new EventListener(callback));
    return this.eventListeners[eventName].length - 1;
  }

  public RemoveListener(eventName: string, token: number): void {
    const listeners = this.eventListeners[eventName];
    if (listeners) {
      const listener = listeners[token];
      if (listener) {
        listener.active = false;
      }
    }
  }

  private InternalDispatch<T>({ type, payload, callback }: EventAction<T>) {
    const listeners = this.eventListeners[type];
    if (listeners) {
      listeners.forEach((l) => {
        if (l.active) {
          l.callback(payload, callback);
        }
      });
    }
  }

  private eventListeners: {[key: string]: EventListener[]};

  private lowPriorityEventQueue: EventAction<any>[];
}

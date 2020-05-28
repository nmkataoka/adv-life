import { ECSystem } from './ECSystem';
import {
  GetComponentFuncType,
  GetComponentManagerFuncType,
} from './types/EntityManagerAccessorTypes';

export type EventCallback = (payload: any) => void;

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
}

export class EventSys extends ECSystem {
  constructor(
    getComponent: GetComponentFuncType,
    getComponentManager: GetComponentManagerFuncType,
  ) {
    super(getComponent, getComponentManager);
    this.eventListeners = {};
    this.lowPriorityEventQueue = [];
  }

  public Start(): void {}

  public OnUpdate(): void {
    this.ExecuteLowPriorityActions();
  }

  // Low priority actions are deferred in a queue to be executed after the current tick finishes.
  // High priority actions are dispatched immediately.
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

  private InternalDispatch<T>({ type, payload }: EventAction<T>) {
    const listeners = this.eventListeners[type];
    if (listeners) {
      listeners.forEach((l) => {
        if (l.active) {
          l.callback(payload);
        }
      });
    }
  }

  private eventListeners: {[key: string]: EventListener[]};

  private lowPriorityEventQueue: EventAction<any>[];
}

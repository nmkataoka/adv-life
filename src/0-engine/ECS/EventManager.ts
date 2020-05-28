export type EventCallback = (payload: any) => void;

export class EventListener {
  public callback: EventCallback;

  public active: boolean;

  constructor(callback: EventCallback) {
    this.active = true;
    this.callback = callback;
  }
}

export type EventAction = {
  type: string;
  payload: any;
}

export class EventManager {
  constructor() {
    this.eventListeners = {};
    this.lowPriorityEventQueue = [];
  }

  // Low priority actions are deferred in a queue to be executed after the current tick finishes.
  // High priority actions are dispatched immediately.
  public Dispatch(action: EventAction, lowPriority = false): void {
    if (lowPriority) {
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

  private InternalDispatch({ type, payload }: EventAction) {
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

  private lowPriorityEventQueue: EventAction[];
}

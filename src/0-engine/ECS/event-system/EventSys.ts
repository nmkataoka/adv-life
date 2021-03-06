import { DefaultEvent } from '../built-in-components';
import {
  AbstractComponentClasses,
  ComponentClasses,
} from '../component-dependencies/ComponentDependencies';
import { EntityManager } from '../EntityManager';
import { EventAction, EventActionWithPromise } from './EventAction';
import { EventCallbackError } from './EventCallback';
import { EventListener } from './EventListener';

export type Dispatch = EventSys['dispatch'];

export class EventSys {
  constructor(eMgr: EntityManager) {
    this.eMgr = eMgr;
    this.eventListeners = {};
    this.lowPriorityEventQueue = [];
  }

  public async Start(): Promise<void> {
    await this.dispatch({ type: DefaultEvent.Start, payload: undefined });
  }

  public OnUpdate = async (dt: number): Promise<void> => {
    await this.ExecuteLowPriorityActions();
    await this.dispatch({ type: DefaultEvent.Update, payload: { dt } });
  };

  // Low priority actions are deferred in a queue to be executed after the current tick finishes.
  // High priority actions are dispatched immediately.
  // All actions coming from the frontend should be low priority.
  public dispatch = async <T>(action: EventAction<T>, isLowPriority = false): Promise<void> => {
    if (isLowPriority) {
      const promise = new Promise<void>((resolve, reject) => {
        const actionWithPromise = { ...action, promise: { resolve, reject } };
        this.lowPriorityEventQueue.push(actionWithPromise);
      });
      return promise;
    }
    return this.InternalDispatch(action);
  };

  private ExecuteLowPriorityActions = async (): Promise<void> => {
    const promises = this.lowPriorityEventQueue.map(async (actionWithPromise) => {
      const { promise, ...action } = actionWithPromise;
      promise.resolve(await this.InternalDispatch(action));
    });
    await Promise.all(promises);
    this.lowPriorityEventQueue = [];
  };

  // Returns a token that can be used to deregister a listener
  public RegisterListener = <Payload, ComponentDependencies extends AbstractComponentClasses>(
    eventName: string,
    listener: EventListener<Payload, ComponentDependencies>,
  ): number => {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }

    this.eventListeners[eventName].push(listener);
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

  private InternalDispatch = async <T extends unknown>({ payload, type }: EventAction<T>) => {
    const listeners = this.eventListeners[type];
    let promises: Promise<void>[] = [];
    if (listeners) {
      promises = listeners.map(async (l) => {
        if (l.active) {
          const componentManagers = l.componentDependencies.getComponentManagers(this.eMgr);
          return l.callback({ eMgr: this.eMgr, componentManagers, payload });
        }
        return Promise.resolve();
      });
    }

    // After listeners finish, collect all the errors (if any)
    await Promise.allSettled(promises);
    const errors = await promises.reduce(async (errorArr: Promise<EventCallbackError[]>, p) => {
      const eventCallbackErrors = await errorArr;
      try {
        await p;
        return eventCallbackErrors;
      } catch (e) {
        const err = e as EventCallbackError;
        return [...eventCallbackErrors, err];
      }
    }, Promise.resolve([]));

    // If there are errors, reject
    if (errors.length > 0) {
      // eslint-disable-next-line no-console
      console.error(`Api error: ${errors.map((error) => error.message).join('\n')}`);
      return Promise.reject(errors);
    }

    return Promise.resolve();
  };

  private eMgr: EntityManager;

  private eventListeners: { [key: string]: EventListener<any, ComponentClasses<any, any, any>>[] };

  private lowPriorityEventQueue: EventActionWithPromise<any>[];
}

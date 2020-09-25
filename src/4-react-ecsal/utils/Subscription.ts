import { GameManager } from '0-engine/GameManager';
import { getBatch } from './batch';

// encapsulates the subscription logic for connecting a component to the ecsal store, as
// well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants

type Callback = () => void;
type Listener = {
  callback: Callback;
  next: Listener | null;
  prev: Listener | null;
};
type ListenerCollection = {
  clear: () => void;
  notify: () => void;
  get: () => Listener[];
  subscribe: (callback: Callback) => () => void;
};
const nullListeners: ListenerCollection = {
  clear() {},
  notify() {},
  get() {
    return [];
  },
  subscribe() {
    return () => {};
  },
};

function createListenerCollection(): ListenerCollection {
  const batch = getBatch();
  let first: Listener | null = null;
  let last: Listener | null = null;

  return {
    clear() {
      first = null;
      last = null;
    },

    notify() {
      batch(() => {
        let listener = first;
        while (listener) {
          listener.callback();
          listener = listener.next;
        }
      });
    },

    get() {
      const listeners: Listener[] = [];
      let listener = first;
      while (listener) {
        listeners.push(listener);
        listener = listener.next;
      }
      return listeners;
    },

    subscribe(callback: Callback): () => void {
      let isSubscribed = true;

      // eslint-disable-next-line no-multi-assign
      const listener: Listener = (last = {
        callback,
        next: null,
        prev: last,
      });

      if (listener.prev) {
        listener.prev.next = listener;
      } else {
        first = listener;
      }

      return function unsubscribe() {
        if (!isSubscribed || first === null) return;
        isSubscribed = false;

        if (listener.next) {
          listener.next.prev = listener.prev;
        } else {
          last = listener.prev;
        }
        if (listener.prev) {
          listener.prev.next = listener.next;
        } else {
          first = listener.next;
        }
      };
    },
  };
}

/* eslint-disable @typescript-eslint/unbound-method */
export class Subscription {
  public store: GameManager;

  public parentSub?: Subscription;

  public unsubscribe: (() => void) | null;

  public listeners: ListenerCollection;

  public onStateChange: (() => void) | undefined | null;

  constructor(store: GameManager, parentSub?: Subscription) {
    this.store = store;
    this.parentSub = parentSub;
    this.unsubscribe = null;
    this.listeners = nullListeners;

    this.handleChangeWrapper = this.handleChangeWrapper.bind(this);
  }

  addNestedSub(callback: Callback): () => void {
    this.trySubscribe();
    return this.listeners.subscribe(callback);
  }

  notifyNestedSubs(): void {
    this.listeners.notify();
  }

  handleChangeWrapper(): void {
    if (this.onStateChange) {
      this.onStateChange();
    }
  }

  isSubscribed(): boolean {
    return Boolean(this.unsubscribe);
  }

  trySubscribe(): void {
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub
        ? this.parentSub.addNestedSub(this.handleChangeWrapper)
        : this.store.subscribe(this.handleChangeWrapper);

      this.listeners = createListenerCollection();
    }
  }

  tryUnsubscribe(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      this.listeners.clear();
      this.listeners = nullListeners;
    }
  }
}

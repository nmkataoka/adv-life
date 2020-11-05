import deepEqual from 'fast-deep-equal';
import {
  MutableRefObject,
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { EntityManager } from '0-engine';
import { GameManager } from '0-engine/GameManager';
import { DeepReadonly } from 'ts-essentials';
import { useEcsalContext } from './useEcsalContext';
import { Subscription } from '../utils/Subscription';

export type Selector<Data> = (eMgr: EntityManager) => DeepReadonly<Data>;

type Comparator = (a: any, b: any) => boolean;

const useSelectorWithStoreAndSubscription = <Data>(
  selector: Selector<Data>,
  equalityFn: Comparator,
  store: GameManager,
  contextSub: Subscription,
) => {
  const [, forceRender] = useReducer((s: number) => s + 1, 0);

  const subscription = useMemo(() => new Subscription(store, contextSub), [store, contextSub]);

  const latestSubscriptionCallbackError: MutableRefObject<Error | undefined> = useRef();
  const latestSelector: MutableRefObject<Selector<Data> | undefined> = useRef();
  const latestStoreState: MutableRefObject<EntityManager | undefined> = useRef();
  const latestSelectedState: MutableRefObject<Data | undefined> = useRef();

  const storeState = store.eMgr;
  let selectedState: Data;

  try {
    // If we ever implement pseudo-immutability in the engine,
    // we can use it to short circuit here for performance
    // if(
    //   selector !== latestSelector.current ||
    //   storeState !== latestStoreState.current || // Immutability needed here
    //   latestSubscriptionCallbackError.current
    // ) {
    selectedState = selector(storeState) as Data;
    // } else {
    // selectedState = latestSelectedState.current;
    // }
  } catch (err) {
    if (latestSubscriptionCallbackError.current != null) {
      err.message += `\nThe error may be correlated with this previous error:\n${
        latestSubscriptionCallbackError.current.stack ?? 'undefined'
      }\n\n`;
    }

    throw err;
  }

  useLayoutEffect(() => {
    latestSelector.current = selector;
    latestStoreState.current = storeState;
    latestSelectedState.current = selectedState;
    latestSubscriptionCallbackError.current = undefined;
  });

  useLayoutEffect(() => {
    const checkForUpdates = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line
        const newSelectedState = latestSelector.current(store) as Data;

        if (equalityFn(newSelectedState, latestSelectedState.current)) {
          return;
        }

        latestSelectedState.current = newSelectedState;
      } catch (err) {
        // we ignore all errors here, since when the component
        // is re-rendered, the selectors are called again, and
        // will throw again, if neither props nor store state
        // changed
        latestSubscriptionCallbackError.current = err;
      }

      forceRender();
    };

    subscription.onStateChange = checkForUpdates;
    subscription.trySubscribe();

    checkForUpdates();

    return () => subscription.tryUnsubscribe();
    // We're not going to bother rerunning this hook if the equality function changes
    // since you really shouldn't be changing it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, subscription]);

  return selectedState;
};

export const useSelector = <Data>(selector: Selector<Data>, equalityFn = deepEqual): Data => {
  if (process.env.NODE_ENV !== 'production' && !selector) {
    throw new Error(`You must pass a selector to useSelector`);
  }
  const { store, subscription: contextSub } = useEcsalContext();

  const selectedState = useSelectorWithStoreAndSubscription(
    selector,
    equalityFn,
    store,
    contextSub,
  );

  useDebugValue(selectedState);

  return selectedState;
};

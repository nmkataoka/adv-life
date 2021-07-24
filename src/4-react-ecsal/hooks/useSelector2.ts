import { MutableRefObject, useCallback, useDebugValue, useEffect, useReducer, useRef } from 'react';
import { isEqual, VersionedData } from '0-engine';
import { DeepReadonly } from 'ts-essentials';

import { useEcsalContext } from './useEcsalContext';
import { Node, read } from '../../0-engine/ECS/query/node';

export const useSelector2 = <Data>(node: Node<Data>): DeepReadonly<Data | undefined> => {
  const [, forceRender] = useReducer((s: number) => s + 1, 0);
  const { store, cacheState } = useEcsalContext();
  const latestNodeState: MutableRefObject<VersionedData<Data | undefined>> = useRef(
    read(cacheState, store, node),
  );
  if (process.env.NODE_ENV !== 'production' && !node) {
    throw new Error(`You must pass a selector to useSelector`);
  }

  const update = useCallback(() => {
    const newState = read(cacheState, store, node);
    if (latestNodeState.current && isEqual(newState, latestNodeState.current)) {
      return;
    }
    latestNodeState.current = newState;
    forceRender();
  }, [cacheState, node, store]);

  // Subscribe to updates
  useEffect(() => {
    const unsubscribe = store.subscribe(update);
    return () => unsubscribe();
  }, [store, update]);

  useDebugValue(latestNodeState.current?.[0]);

  return latestNodeState.current[0];
};

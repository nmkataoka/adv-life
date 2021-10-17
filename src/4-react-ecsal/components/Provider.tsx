import { EntityManager } from '0-engine';
import { Context as ReactContext, useMemo, ReactNode, useEffect, useCallback } from 'react';
import { commit, createCacheState } from '0-engine/ECS/query/node';
import ReactEcsalContext, { ContextValue } from './Context';

type ProviderProps = {
  store: EntityManager;
  context?: ReactContext<ContextValue>;
  children: ReactNode;
};

const Provider = ({ store, context, children }: ProviderProps): JSX.Element => {
  const contextValue: ContextValue = useMemo(() => {
    const cacheState = createCacheState();
    return {
      store,
      cacheState,
    };
  }, [store]);

  const handleTickEnd = useCallback(() => {
    commit(contextValue.cacheState);
  }, [contextValue]);

  // Clear the cache whenever the store updates
  useEffect(() => {
    const unsubscribe = contextValue.store.subscribe(handleTickEnd);
    return () => unsubscribe();
  }, [handleTickEnd, contextValue]);

  const Context = context || ReactEcsalContext;

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default Provider;

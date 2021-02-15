import { EntityManager } from '0-engine';
import { Context as ReactContext, useMemo, ReactNode } from 'react';
import ReactEcsalContext, { ContextValue } from './Context';
import { createCacheState } from '../utils/node';

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

  const Context = context || ReactEcsalContext;

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default Provider;

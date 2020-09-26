import { GameManager } from '0-engine/GameManager';
import { Subscription } from '4-react-ecsal/utils/Subscription';
import React, { useEffect, useMemo } from 'react';
import ReactEcsalContext, { ContextValue } from './Context';

type ProviderProps = {
  store: GameManager;
  context?: React.Context<ContextValue>;
  children: React.ReactNode;
};

const Provider = ({ store, context, children }: ProviderProps): JSX.Element => {
  const contextValue = useMemo(() => {
    const subscription = new Subscription(store);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    subscription.onStateChange = subscription.notifyNestedSubs;
    return {
      store,
      subscription,
    };
  }, [store]);

  const previousState = useMemo(() => store.eMgr, [store]);

  useEffect(() => {
    const { subscription } = contextValue;
    subscription.trySubscribe();

    // Opportunity to optimize here if pseudo-immutability is implemented
    // if(previousState !== store.eMgr) {
    subscription.notifyNestedSubs();
    // }
    return () => {
      subscription.tryUnsubscribe();
      subscription.onStateChange = null;
    };
  }, [contextValue, previousState]);

  const Context = context || ReactEcsalContext;

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default Provider;

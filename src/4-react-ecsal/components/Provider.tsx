import { EntityManager } from '0-engine';
import { Subscription } from '4-react-ecsal/utils/Subscription';
import { Context as ReactContext, useEffect, useMemo, ReactNode } from 'react';
import ReactEcsalContext, { ContextValue } from './Context';

type ProviderProps = {
  store: EntityManager;
  context?: ReactContext<ContextValue>;
  children: ReactNode;
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

  const previousState = useMemo(() => store, [store]);

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

import { EntityManager } from '0-engine';
import { Subscription } from '4-react-ecsal/utils/Subscription';
import React from 'react';

export type ContextValue = {
  store: EntityManager;
  subscription: Subscription;
};

// eslint-disable-next-line
// @ts-ignore React.createContext default value has typescript issues
const ReactEcsalContext: React.Context<ContextValue> = React.createContext(null);

if (process.env.NODE_ENV !== 'production') {
  ReactEcsalContext.displayName = 'ReactRedux';
}

export default ReactEcsalContext;

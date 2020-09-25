import { GameManager } from '0-engine/GameManager';
import { Subscription } from '4-react-ecsal/utils/Subscription';
import React from 'react';

export type ContextValue = {
  store: GameManager;
  subscription: Subscription;
};

// eslint-disable-next-line
// @ts-ignore React.createContext default value has typescript issues
const ReactEcsalContext: React.Context<ContextValue> = React.createContext(null);

if (process.env.NODE_ENV !== 'production') {
  ReactEcsalContext.displayName = 'ReactRedux';
}

export default ReactEcsalContext;

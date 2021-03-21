import { EntityManager } from '0-engine';
import { Context, createContext } from 'react';
import { CacheState } from '../utils/node';

export type ContextValue = {
  store: EntityManager;
  cacheState: CacheState;
};

// eslint-disable-next-line
// @ts-ignore React.createContext default value has typescript issues
const ReactEcsalContext: Context<ContextValue> = createContext(null);

if (process.env.NODE_ENV !== 'production') {
  ReactEcsalContext.displayName = 'ReactRedux';
}

export default ReactEcsalContext;

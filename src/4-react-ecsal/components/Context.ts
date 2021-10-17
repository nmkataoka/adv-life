import { EntityManager } from '0-engine';
import { Context, createContext } from 'react';
import { CacheState } from '../../0-engine/ECS/query/node';

export type ContextValue = {
  store: EntityManager;
  cacheState: CacheState;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore React.createContext default value has typescript issues
const ReactEcsalContext: Context<ContextValue> = createContext(null);

if (process.env.NODE_ENV !== 'production') {
  ReactEcsalContext.displayName = 'ReactRedux';
}

export default ReactEcsalContext;

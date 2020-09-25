import { useContext } from 'react';
import ReactEcsalContext, { ContextValue } from '../components/Context';

/**
 * A hook to access the value of the `ReactEcsalContext`. This is a low-level
 * hook that you should usually not need to call directly.
 *
 * @returns {any} the value of the `ReactEcsalContext`
 *
 * @example
 *
 * import React from 'react'
 * import { useEcsalContext } from 'react-ecsal'
 *
 * export const CounterComponent = ({ value }) => {
 *   const { store } = useEcsalContext() // TODO: update this to whatever the context really is
 *   return <div>{store}</div>
 * }
 */
export function useEcsalContext(): ContextValue {
  const contextValue = useContext(ReactEcsalContext);

  if (process.env.NODE_ENV !== 'production' && !contextValue) {
    throw new Error(
      'could not find react-ecsal context value; please ensure the component is wrapped in a <Provider>',
    );
  }

  return contextValue;
}

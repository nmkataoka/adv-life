import { GameManager } from '0-engine/GameManager';
import { useContext } from 'react';
import ReactEcsalContext from '../components/Context';
import { useEcsalContext as useDefaultEcsalContext } from './useEcsalContext';

/**
 * Hook factory, which creates a `useStore` hook bound to a given context.
 *
 * @param Context passed to your `<Provider>`.
 * @returns A `useStore` hook bound to the specified context.
 */
export function createStoreHook(context = ReactEcsalContext): () => GameManager {
  const useEcsalContext =
    context === ReactEcsalContext ? useDefaultEcsalContext : () => useContext(context);

  return function useStore() {
    const { store } = useEcsalContext();
    return store;
  };
}

export const useStore = createStoreHook();

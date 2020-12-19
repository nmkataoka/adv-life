import { EntityManager } from '0-engine';
import ReactEcsalContext from '../components/Context';
import { useStore as useDefaultStore, createStoreHook } from './useStore';

/**
 * Hook Factory, which creates a `useDispatch` hook bound to a given context.
 *
 * @param Context passed to your `<Provider>`.
 * @returns A `useDispatch` hook bound to the specified context.
 */
export function createDispatchHook(context = ReactEcsalContext): () => EntityManager['dispatch'] {
  const useStore = context === ReactEcsalContext ? useDefaultStore : createStoreHook(context);

  return function useDispatch() {
    const store = useStore();
    return store.dispatch;
  };
}

/**
 * A hook to access Ecsal's `dispatch` function.
 *
 * @returns Ecsal's `dispatch` function
 */
export const useDispatch = createDispatchHook();

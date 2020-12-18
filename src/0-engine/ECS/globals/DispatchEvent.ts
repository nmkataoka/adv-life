import { EntityManager } from '../EntityManager';
import { EventAction } from '../event-system';

/** @deprecated Global accessor functions should not be used. */
export function DispatchEvent<T>(action: EventAction<T>): Promise<void> {
  return EntityManager.instance.dispatch(action);
}

import { EntityManager } from '../EntityManager';
import { EventSys, EventAction } from '../event-system';

/** @deprecated Global accessor functions should not be used. */
export function DispatchEvent<T>(action: EventAction<T>, isLowPriority = false): Promise<void> {
  const eventSys = EntityManager.instance.getSys(EventSys);
  return eventSys.Dispatch(action, isLowPriority);
}

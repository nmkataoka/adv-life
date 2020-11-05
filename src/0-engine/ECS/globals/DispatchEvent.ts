import { EntityManager } from '../EntityManager';
import { EventSys, EventAction } from '../event-system';

/** @deprecated Global accessor functions should not be used. */
export function DispatchEvent<T>(action: EventAction<T>, isLowPriority = false): Promise<void> {
  return GetEventSys().Dispatch(action, isLowPriority);
}

/** @deprecated Global accessor functions should not be used. */
export function GetEventSys(): EventSys {
  return EntityManager.instance.getSys(EventSys);
}

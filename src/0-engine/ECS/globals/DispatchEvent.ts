import { EntityManager } from '../EntityManager';
import { EventSys, EventAction } from '../event-system/EventSys';

/** @deprecated Global accessor functions should not be used. */
export function DispatchEvent<T>(action: EventAction<T>, isLowPriority = false): void {
  return GetEventSys().Dispatch(action, isLowPriority);
}

/** @deprecated Global accessor functions should not be used. */
export function GetEventSys(): EventSys {
  return EntityManager.instance.GetSystem(EventSys);
}

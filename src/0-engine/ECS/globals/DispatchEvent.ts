import { EntityManager } from '../EntityManager';
import { EventSys, EventAction } from '../EventSys';

export function DispatchEvent<T>(action: EventAction<T>, isLowPriority = false): void {
  return GetEventSys().Dispatch(action, isLowPriority);
}

export function GetEventSys(): EventSys {
  return EntityManager.instance.GetSystem(EventSys);
}

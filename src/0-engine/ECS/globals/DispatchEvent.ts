import { EntityManager } from '../EntityManager';
import { EventSys, EventAction } from '../EventSys';

export function DispatchEvent(action: EventAction, isLowPriority = false): void {
  return EntityManager.instance.GetSystem(EventSys).Dispatch(action, isLowPriority);
}

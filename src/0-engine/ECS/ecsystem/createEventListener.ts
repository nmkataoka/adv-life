import { ComponentClasses } from '../ComponentDependencies';
import { EventAction, EventCallback, EventListener, EventListenerWithView } from '../event-system';
import { EventCallbackWithView } from '../event-system/EventCallback';
import { NComponent } from '../NComponent';

type EventCreator<Payload> = { (payload: Payload): EventAction<Payload>; type: string };

/**
 * Return value of createEventListener. Only contains one event listener,
 * unlike Redux Toolkit's Slice.
 */
type EventSlice<
  Payload,
  ReadCmpts extends NComponent[],
  WriteCmpts extends NComponent[],
  WithoutCmpts extends NComponent[] = []
> = {
  createEvent: EventCreator<Payload>;
  eventListener: EventListener<Payload, ReadCmpts, WriteCmpts, WithoutCmpts>;
};

function createEventName(callbackName: string, scope: string): string {
  let eventType = '';
  if (scope) {
    eventType += `${scope}/`;
  }
  eventType += `${callbackName}`;
  return eventType;
}

export function createEventListener<
  Payload,
  ReadCmpts extends NComponent[],
  WriteCmpts extends NComponent[],
  WithoutCmpts extends NComponent[] = []
>(
  componentDependencies: ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>,
  eventCallback: EventCallback<Payload, ReadCmpts, WriteCmpts, WithoutCmpts>,
  scope = '',
): EventSlice<Payload, ReadCmpts, WriteCmpts, WithoutCmpts> {
  const eventType = createEventName(eventCallback.name, scope);
  const createEvent: EventCreator<Payload> = (payload: Payload) => ({ type: eventType, payload });
  createEvent.type = eventCallback.name;
  return {
    createEvent,
    eventListener: new EventListener(componentDependencies, eventCallback),
  };
}

export function createEventListenerWithView<
  Payload,
  ReadCmpts extends NComponent[],
  WriteCmpts extends NComponent[],
  WithoutCmpts extends NComponent[]
>(
  componentDependencies: ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>,
  eventCallback: EventCallbackWithView<Payload, ReadCmpts, WriteCmpts, WithoutCmpts>,
  scope = '',
): EventSlice<Payload, ReadCmpts, WriteCmpts, WithoutCmpts> {
  const eventType = createEventName(eventCallback.name, scope);
  const createEvent: EventCreator<Payload> = (payload: Payload) => ({ type: eventType, payload });
  createEvent.type = eventType;
  const eventListener = new EventListenerWithView(componentDependencies, eventCallback);
  return { createEvent, eventListener };
}

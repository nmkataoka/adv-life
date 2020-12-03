import { AbstractComponentClasses } from '../ComponentDependencies';
import { EventAction, EventCallback, EventListener, EventListenerWithView } from '../event-system';
import { EventCallbackWithView } from '../event-system/EventCallback';

type EventCreator<Payload> = { (payload: Payload): EventAction<Payload>; type: string };

/**
 * Return value of createEventListener. Only contains one event listener,
 * unlike Redux Toolkit's Slice.
 */
type EventSlice<Payload, ComponentDependencies extends AbstractComponentClasses> = {
  createEvent: EventCreator<Payload>;
  eventListener: EventListener<Payload, ComponentDependencies>;
};

function createEventName(callbackName: string, scope: string): string {
  let eventType = '';
  if (scope) {
    eventType += `${scope}/`;
  }
  eventType += `${callbackName}`;
  return eventType;
}

export const createEventListener = <ComponentDependencies extends AbstractComponentClasses>(
  componentDependencies: ComponentDependencies,
) => <Payload>(
  eventCallback: EventCallback<Payload, ComponentDependencies>,
  scope = '',
): EventSlice<Payload, ComponentDependencies> => {
  const eventType = createEventName(eventCallback.name, scope);
  const createEvent: EventCreator<Payload> = (payload: Payload) => ({ type: eventType, payload });
  createEvent.type = eventCallback.name;
  return {
    createEvent,
    eventListener: new EventListener(componentDependencies, eventCallback),
  };
};

export function createEventListenerWithView<
  Payload,
  ComponentDependencies extends AbstractComponentClasses
>(
  componentDependencies: ComponentDependencies,
  eventCallback: EventCallbackWithView<Payload, ComponentDependencies>,
  scope = '',
): EventSlice<Payload, ComponentDependencies> {
  const eventType = createEventName(eventCallback.name, scope);
  const createEvent: EventCreator<Payload> = (payload: Payload) => ({ type: eventType, payload });
  createEvent.type = eventType;
  const eventListener = new EventListenerWithView(componentDependencies, eventCallback);
  return { createEvent, eventListener };
}

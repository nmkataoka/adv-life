import { AbstractComponentClasses, ComponentClasses } from '../ComponentDependencies';
import { EventAction, EventCallback, EventListener, EventListenerWithView } from '../event-system';
import { EventCallbackWithView } from '../event-system/EventCallback';
import { NComponent } from '../NComponent';

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

export function createEventListener<
  ReadCmpts extends NComponent[] = [],
  WriteCmpts extends NComponent[] = [],
  WithoutCmpts extends NComponent[] = []
>(componentDependencies: Partial<ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>>) {
  return <Payload>(
    eventCallback: EventCallback<Payload, ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>>,
    scope = '',
  ): EventSlice<Payload, ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>> => {
    const eventType = createEventName(eventCallback.name, scope);
    const createEvent: EventCreator<Payload> = (payload: Payload) => ({ type: eventType, payload });
    createEvent.type = eventCallback.name;
    return {
      createEvent,
      eventListener: new EventListener(new ComponentClasses(componentDependencies), eventCallback),
    };
  };
}

export function createEventListenerWithView<
  ReadCmpts extends NComponent[] = [],
  WriteCmpts extends NComponent[] = [],
  WithoutCmpts extends NComponent[] = []
>(componentDependencies: Partial<ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>>) {
  return <Payload>(
    eventCallback: EventCallbackWithView<
      Payload,
      ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>
    >,
    scope = '',
  ): EventSlice<Payload, ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>> => {
    const eventType = createEventName(eventCallback.name, scope);
    const createEvent: EventCreator<Payload> = (payload: Payload) => ({ type: eventType, payload });
    createEvent.type = eventType;
    const eventListener = new EventListenerWithView(
      new ComponentClasses(componentDependencies),
      eventCallback,
    );
    return { createEvent, eventListener };
  };
}

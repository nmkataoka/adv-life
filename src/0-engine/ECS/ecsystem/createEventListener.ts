import { AbstractComponentClasses, ComponentClasses } from '../ComponentDependencies';
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
  EventName extends string,
  ComponentDependencies extends AbstractComponentClasses
> = Record<EventName, EventCreator<Payload>> & {
  eventListener: EventListener<Payload, ComponentDependencies>;
};

function createEventName(eventName: string, scope: string): string {
  let eventType = '';
  if (scope) {
    eventType += `${scope}/`;
  }
  eventType += `${eventName}`;
  return eventType;
}

export function createEventSlice<
  EventName extends string,
  ReadCmpts extends NComponent[] = [],
  WriteCmpts extends NComponent[] = [],
  WithoutCmpts extends NComponent[] = []
>(
  eventName: EventName,
  componentDependencies: Partial<ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>>,
) {
  return <Payload>(
    eventCallback: EventCallback<Payload, ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>>,
    scope = '',
  ): EventSlice<Payload, EventName, ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>> => {
    const eventType = createEventName(eventName, scope);
    const createEvent: EventCreator<Payload> = (payload: Payload) => ({ type: eventType, payload });
    createEvent.type = eventType;
    return {
      [eventName]: createEvent,
      eventListener: new EventListener(
        eventType,
        new ComponentClasses(componentDependencies),
        eventCallback,
      ),
    } as EventSlice<Payload, EventName, ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>>;
  };
}

/** For letting an event listener respond to multiple events */
export function copyEventSlice<
  EventName extends string,
  Payload,
  ComponentDependencies extends AbstractComponentClasses
>(
  eventName: EventName,
  eventSlice: EventSlice<Payload, any, ComponentDependencies>,
): EventSlice<Payload, EventName, ComponentDependencies> {
  return createEventSlice(
    eventName,
    eventSlice.eventListener.componentDependencies,
  )(eventSlice.eventListener.callback) as EventSlice<Payload, EventName, ComponentDependencies>;
}

export function createEventSliceWithView<
  EventName extends string,
  ReadCmpts extends NComponent[] = [],
  WriteCmpts extends NComponent[] = [],
  WithoutCmpts extends NComponent[] = []
>(
  eventName: EventName,
  componentDependencies: Partial<ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>>,
) {
  return <Payload>(
    eventCallback: EventCallbackWithView<
      Payload,
      ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>
    >,
    scope = '',
  ): EventSlice<Payload, EventName, ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>> => {
    const eventType = createEventName(eventName, scope);
    const createEvent: EventCreator<Payload> = (payload: Payload) => ({ type: eventType, payload });
    createEvent.type = eventType;
    const eventListener = new EventListenerWithView(
      eventType,
      new ComponentClasses(componentDependencies),
      eventCallback,
    );
    return { [eventName]: createEvent, eventListener } as EventSlice<
      Payload,
      EventName,
      ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>
    >;
  };
}

import {
  AbstractComponentClasses,
  ComponentClasses,
} from '../component-dependencies/ComponentDependencies';
import { EventAction } from '.';
import { EventCallback, EventCallbackWithView } from './EventCallback';
import { EventListener, EventListenerWithView } from './EventListener';
import { NComponent } from '../NComponent';

type EventCreator<Payload> = { (payload: Payload): EventAction<Payload>; type: string };

/**
 * Return value of createEventListener. Only contains one event listener,
 * unlike Redux Toolkit's Slice.
 */
type EventSlice<
  Payload,
  EventName extends string,
  ComponentDependencies extends AbstractComponentClasses,
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
  WithoutCmpts extends NComponent[] = [],
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

/** For letting an event listener respond to multiple events
 * Not sure if this is the best api. Might be better to let createEventSlice take an array of event names.
 */
export function copyEventSlice<
  EventName extends string,
  Payload,
  ComponentDependencies extends AbstractComponentClasses,
>(
  eventName: EventName,
  eventSlice: EventSlice<Payload, any, ComponentDependencies>,
): EventSlice<Payload, EventName, ComponentDependencies> {
  return createEventSlice(
    eventName,
    eventSlice.eventListener.componentDependencies,
  )(eventSlice.eventListener.callback) as EventSlice<Payload, EventName, ComponentDependencies>;
}

// TODO: for views to be useful, we probably have to add WriteUniqueCmpts and ReadUniqueCmpts
// since we often need access to these singletone classes to operate properly on stuff
export function createEventSliceWithView<
  EventName extends string,
  ReadCmpts extends NComponent[] = [],
  WriteCmpts extends NComponent[] = [],
  WithoutCmpts extends NComponent[] = [],
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

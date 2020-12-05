import {
  AbstractComponentClasses,
  ComponentClasses,
} from '../component-dependencies/ComponentDependencies';
import { View } from '../view/View';
import { EventCallback, EventCallbackArgs, EventCallbackWithView } from './EventCallback';

export class EventListener<
  Payload = undefined,
  ComponentDependencies extends AbstractComponentClasses = ComponentClasses<[], [], []>
> {
  public callback: EventCallback<Payload, ComponentDependencies>;

  public eventType: string;

  public active: boolean;

  public componentDependencies: ComponentDependencies;

  constructor(
    eventType: string,
    componentDependencies: ComponentDependencies,
    callback: EventCallback<Payload, ComponentDependencies>,
  ) {
    this.active = true;
    this.eventType = eventType;
    this.componentDependencies = componentDependencies;
    this.callback = callback;
  }
}

/**
 * Same as EventListener, but parses the ComponentManagers into a View
 * for the EventCallbackWithView.
 */
export class EventListenerWithView<
  Payload,
  ComponentDependencies extends AbstractComponentClasses = ComponentClasses<[], [], []>
> extends EventListener<Payload, ComponentDependencies> {
  constructor(
    eventType: string,
    componentDependencies: ComponentDependencies,
    callback: EventCallbackWithView<Payload, ComponentDependencies>,
  ) {
    super(
      eventType,
      componentDependencies,
      ({ componentManagers, eMgr, payload }: EventCallbackArgs<Payload, ComponentDependencies>) => {
        return callback({
          eMgr,
          view: new View(componentDependencies, undefined, componentManagers),
          payload,
        });
      },
    );
  }
}

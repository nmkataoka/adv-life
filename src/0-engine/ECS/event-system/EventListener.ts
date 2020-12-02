import { ComponentClasses } from '../ComponentDependencies';
import { NComponent } from '../NComponent';
import { View } from '../View';
import { EventCallback, EventCallbackArgs, EventCallbackWithView } from './EventCallback';

export class EventListener<
  Payload,
  ReadCmpts extends NComponent[],
  WriteCmpts extends NComponent[],
  WithoutCmpts extends NComponent[] = []
> {
  public callback: EventCallback<Payload, ReadCmpts, WriteCmpts, WithoutCmpts>;

  public active: boolean;

  public componentDependencies: ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>;

  constructor(
    componentDependencies: ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>,
    callback: EventCallback<Payload, ReadCmpts, WriteCmpts, WithoutCmpts>,
  ) {
    this.active = true;
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
  ReadCmpts extends NComponent[],
  WriteCmpts extends NComponent[],
  WithoutCmpts extends NComponent[] = []
> extends EventListener<Payload, ReadCmpts, WriteCmpts, WithoutCmpts> {
  constructor(
    componentDependencies: ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>,
    callback: EventCallbackWithView<Payload, ReadCmpts, WriteCmpts, WithoutCmpts>,
  ) {
    super(
      componentDependencies,
      ({
        componentManagers,
        payload,
      }: EventCallbackArgs<Payload, ReadCmpts, WriteCmpts, WithoutCmpts>) => {
        return callback(
          new View<ReadCmpts, WriteCmpts, WithoutCmpts>(
            componentDependencies,
            undefined,
            componentManagers,
          ),
          payload,
        );
      },
    );
  }
}

import {
  AbstractComponentClasses,
  ComponentClasses,
  ComponentManagersFromClasses,
} from '../component-dependencies/ComponentDependencies';
import { EntityManager } from '../EntityManager';
import { View } from '../view/View';

export type EventCallbackArgs<Payload, ComponentDependencies extends AbstractComponentClasses> = {
  componentManagers: ComponentManagersFromClasses<ComponentDependencies>;
  payload: Payload;

  /**
   * Avoid using this whenever possible!
   *
   * @deprecated Use ComponentManagers or View that are automatically supplied.
   * Use of this `eMgr` reference indicates a need to change this architecture.
   */
  eMgr: EntityManager;
};

/**
 * Normal way to implement game code. Operates on a set of component managers
 */
export type EventCallback<
  Payload = undefined,
  ComponentDependencies extends AbstractComponentClasses = ComponentClasses<[], [], []>,
> = (args: EventCallbackArgs<Payload, ComponentDependencies>) => Promise<void> | void;

export class EventCallbackError {
  constructor(message: string) {
    this.message = message;
  }

  public toString(): string {
    return this.message;
  }

  public message: string;
}

export type EventCallbackWithViewArgs<
  Payload,
  ComponentDependences extends AbstractComponentClasses,
> = {
  view: View<ComponentDependences>;
  payload: Payload;
  /**
   * Avoid using this whenever possible!
   *
   * @deprecated Use ComponentManagers or View that are automatically supplied.
   * Use of this `eMgr` reference indicates a need to change this architecture.
   */
  eMgr: EntityManager;
};

/** Event callback for iterating over entities with the same components.
 * Prefer this over the normal EventCallback when it makes sense.
 */
export type EventCallbackWithView<
  Payload,
  ComponentDependencies extends AbstractComponentClasses = ComponentClasses<[], [], []>,
> = (args: EventCallbackWithViewArgs<Payload, ComponentDependencies>) => Promise<void> | void;

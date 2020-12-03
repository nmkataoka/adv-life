import { ComponentClasses, ComponentManagers } from '../ComponentDependencies';
import { EntityManager } from '../EntityManager';
import { NComponent } from '../NComponent';
import { View } from '../View';

type AbstractComponentClasses = ComponentClasses<NComponent[], NComponent[], NComponent[]>;

export type EventCallbackArgs<Payload, ComponentDependencies extends AbstractComponentClasses> = {
  componentManagers: ComponentDependencies extends ComponentClasses<
    infer ReadCmpts,
    infer WriteCmpts,
    infer WithoutCmpts
  >
    ? ComponentManagers<ReadCmpts, WriteCmpts, WithoutCmpts>
    : never;
  payload: Payload;

  /**
   * Avoid using this whenever possible!
   *
   * @deprecated Use ComponentManagers or View that are automatically supplied.
   * Use of this `eMgr` reference indicates a need to change this architecture.
   */
  eMgr: EntityManager;
};

// export type EventCallbackArgs<
//   Payload,
//   ReadCmpts extends NComponent[] = [],
//   WriteCmpts extends NComponent[] = [],
//   WithoutCmpts extends NComponent[] = []
// > = {
//   componentManagers: ComponentManagers<ReadCmpts, WriteCmpts, WithoutCmpts>;
//   payload: Payload;

//   /**
//    * Avoid using this whenever possible!
//    *
//    * @deprecated Use ComponentManagers or View that are automatically supplied.
//    * Use of this `eMgr` reference indicates a need to change this architecture.
//    */
//   eMgr: EntityManager;
// };

/**
 * Normal way to implement game code. Operates on a set of component managers
 */
export type EventCallback<
  Payload = undefined,
  // ReadCmpts extends NComponent[] = [],
  // WriteCmpts extends NComponent[] = [],
  // WithoutCmpts extends NComponent[] = []
  ComponentDependencies extends AbstractComponentClasses = ComponentClasses<[], [], []>
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

/** Event callback for iterating over entities with the same components.
 * Prefer this over the normal EventCallback when it makes sense.
 */
export type EventCallbackWithView<
  Payload,
  ReadCmpts extends NComponent[],
  WriteCmpts extends NComponent[],
  WithoutCmpts extends NComponent[]
> = (view: View<ReadCmpts, WriteCmpts, WithoutCmpts>, payload: Payload) => Promise<void>;

import { NComponent, NComponentConstructor } from '../../../../0-engine/ECS/NComponent';
import { EntityManager } from '../../../../0-engine/ECS/EntityManager';

export abstract class ComponentTemplateBase {
  public abstract checkValid(entity: number, eMgr: EntityManager): boolean;

  // References which entity variable this component belongs to
  // E.g. 0 = self (by convention)
  public entityVarIdx = -1;
}

export type ComponentValuePredicate<C> = (component: C) => boolean;

// Matches components via a predicate
//
// This could be made variadic with multiple components per template
// but for now it seems better to have one component per template,
// with a list of templates
export default class ComponentTemplate<
  C extends NComponent,
  CClass extends NComponentConstructor<C>
> extends ComponentTemplateBase {
  constructor(cclass: CClass, pred: ComponentValuePredicate<C>) {
    super();
    this.cclass = cclass;
    this.predicate = pred;
  }

  private cclass: CClass;

  private predicate: ComponentValuePredicate<C>;

  // Check's an entity's component against the individual component condition
  public checkValid(entity: number, eMgr: EntityManager): boolean {
    const component = eMgr.GetComponent<CClass, C>(this.cclass, entity);
    return this.predicate(component);
  }
}

import { NComponentConstructor, NComponent, EntityManager } from '../../../0-engine';

export abstract class ComponentComparisonTemplateBase {
  public abstract checkValid(
    parentEntity: number,
    childEntity: number,
    eMgr: EntityManager,
  ): boolean;
}

export type ComponentComparisonTemplatePredicate<C1, C2> = (c1: C1, c2: C2) => boolean;

export default class ComponentComparisonTemplate<
  C1 extends NComponent,
  C2 extends NComponent
> extends ComponentComparisonTemplateBase {
  public predicate: ComponentComparisonTemplatePredicate<C1, C2>;

  constructor(
    cclass1: NComponentConstructor<C1>,
    cclass2: NComponentConstructor<C2>,
    pred: ComponentComparisonTemplatePredicate<C1, C2>,
  ) {
    super();
    this.cclass1 = cclass1;
    this.cclass2 = cclass2;
    this.predicate = pred;
  }

  public checkValid(parentEntity: number, childEntity: number, eMgr: EntityManager): boolean {
    const c1 = eMgr.GetComponent<C1>(this.cclass1, parentEntity);
    const c2 = eMgr.GetComponent<C2>(this.cclass2, childEntity);
    return this.predicate(c1, c2);
  }

  private cclass1: NComponentConstructor<C1>;

  private cclass2: NComponentConstructor<C2>;
}

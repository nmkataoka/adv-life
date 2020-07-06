import { IEntityRelationship } from './EntityRelationshipTemplate';
import { NComponentConstructor, NComponent } from '../../../0-engine/ECS/NComponent';
import { EntityManager } from '../../../0-engine/ECS/EntityManager';

export abstract class ComponentComparisonTemplateBase {
  public abstract checkValid(
    parentEntity: number,
    childEntity: number,
    eMgr: EntityManager
  ): boolean;
}

export type ComponentComparisonTemplatePredicate<C1, C2> = (c1: C1, c2: C2) => boolean;

export class ComponentComparisonTemplate<
  C1 extends NComponent & IEntityRelationship,
  CClass1 extends NComponentConstructor<C1>,
  C2 extends NComponent & IEntityRelationship,
  CClass2 extends NComponentConstructor<C2>,
> extends ComponentComparisonTemplateBase {
  public predicate: ComponentComparisonTemplatePredicate<C1, C2>;

  constructor(
    cclass1: CClass1,
    cclass2: CClass2,
    pred: ComponentComparisonTemplatePredicate<C1, C2>,
  ) {
    super();
    this.cclass1 = cclass1;
    this.cclass2 = cclass2;
    this.predicate = pred;
  }

  public checkValid(parentEntity: number, childEntity: number, eMgr: EntityManager): boolean {
    const c1 = eMgr.GetComponent<CClass1, C1>(this.cclass1, parentEntity);
    const c2 = eMgr.GetComponent<CClass2, C2>(this.cclass2, childEntity);
    return this.predicate(c1, c2);
  }

  private cclass1: CClass1;

  private cclass2: CClass2;
}

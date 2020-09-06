import { EntityManager } from '../../../../0-engine/ECS/EntityManager';
import { NComponentConstructor } from '../../../../0-engine/ECS/NComponent';
import { GetView } from '../../../../0-engine/ECS/View';

/// Entity template base class. If a component is a subset, i.e. C1 implies C2,
/// C2 doesn't need to be in the template.
export abstract class EntityTemplateBase {
  /// Finds initial candidate entities purely by whether they have the correct set of components.
  /// Doesn't check component values or relationships.
  public abstract findCandidateEntities(eMgr: EntityManager): number[];

  public abstract checkValid(entity: number, eMgr: EntityManager): boolean;
}

type NComponentConstructorArray = NComponentConstructor<any>[];

// Entity templates with variadic templating for entities with variable numbers of components
export default class EntityTemplate<
  T extends NComponentConstructorArray
> extends EntityTemplateBase {
  constructor(...cclasses: T) {
    super();
    this.cclasses = cclasses;
  }

  public findCandidateEntities(): number[] {
    const view = GetView<T>(0, ...this.cclasses);
    return view.entities.map((e) => parseInt(e, 10));
  }

  public checkValid(entity: number, eMgr: EntityManager): boolean {
    const cMgrs = this.cclasses.map((cclass) => eMgr.GetComponentManager(cclass));
    for (let i = 0; i < cMgrs.length; ++i) {
      const cMgr = cMgrs[i];
      if (!cMgr.Has(entity)) return false;
    }
    return true;
  }

  private cclasses: T;
}

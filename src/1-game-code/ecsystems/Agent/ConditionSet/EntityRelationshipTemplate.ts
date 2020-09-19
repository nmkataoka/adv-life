/* Important difference between entityRelationship and componentComparison!
*
* Entity relationships are actual components stored on the parent entity
* Component comparisons are functions which compare two components by value
*/

import { NComponent, NComponentConstructor } from '../../../../0-engine/ECS/NComponent';
import { EntityManager } from '../../../../0-engine/ECS/EntityManager';

/// A special type of NComponent that contains a reference to another entity.
/// Relationships are directional and one-way.
export interface IEntityRelationship {
  // Returns a list of entities
  getChildren(): number[];
}

export abstract class EntityRelationshipTemplateBase {
  // Returns a list of entities
  public abstract getChildren(parentEntity: number, eMgr: EntityManager): number[];

  public abstract checkValid(
    parentEntity: number,
    childEntity: number,
    eMgr: EntityManager
  ): boolean;
}

export default class EntityRelationshipTemplate<
  C extends NComponent & IEntityRelationship,
  CClass extends NComponentConstructor<C>
> extends EntityRelationshipTemplateBase {
  constructor(cclass: CClass) {
    super();
    this.cclass = cclass;
  }

  public getChildren(parentEntity: number, eMgr: EntityManager): number[] {
    const cMgr = eMgr.GetComponentManager<CClass, C>(this.cclass);
    if (!cMgr.Has(parentEntity)) return [];
    return cMgr.GetByNumber(parentEntity).getChildren();
  }

  public checkValid(parentEntity: number, childEntity: number, eMgr: EntityManager): boolean {
    const children = this.getChildren(parentEntity, eMgr);
    return children.includes(childEntity);
  }

  private cclass: CClass;
}

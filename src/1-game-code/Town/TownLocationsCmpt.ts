import { NComponent, Entity } from '../../0-engine';
import { IEntityRelationship } from '../Agent/ConditionSet/EntityRelationshipTemplate';

export class TownLocationsCmpt implements NComponent, IEntityRelationship {
  public locationIds: Entity[] = [];

  public getChildren = (): number[] => this.locationIds.map((e) => e.handle);
}

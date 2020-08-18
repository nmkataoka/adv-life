import { NComponent } from '../../0-engine/ECS/NComponent';
import { IEntityRelationship } from '../../2-ecsystems/Agent/ConditionSet/EntityRelationshipTemplate';
import { Entity } from '../../0-engine/ECS/Entity';

export class TownLocationsCmpt implements NComponent, IEntityRelationship {
  public locations: Entity[] = [];

  public getChildren = (): number[] => this.locations.map((e) => e.handle);
}

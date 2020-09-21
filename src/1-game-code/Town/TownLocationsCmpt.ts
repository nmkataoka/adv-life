import { NComponent } from '../../0-engine';
import { IEntityRelationship } from '../Agent/ConditionSet/EntityRelationshipTemplate';

export class TownLocationsCmpt implements NComponent, IEntityRelationship {
  public locationIds: number[] = [];

  public getChildren = (): number[] => this.locationIds;
}

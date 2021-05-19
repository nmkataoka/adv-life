import { Entity, NComponent, NULL_ENTITY } from '0-engine';
import { BelongsToEntity } from '1-game-code/Agent/ConditionSet/EntityRelationshipTemplate';

export class CivCmpt extends NComponent {
  admin: Entity = NULL_ENTITY;

  towns: Entity[] = [];
}

export class BelongsToCivCmpt extends BelongsToEntity {}

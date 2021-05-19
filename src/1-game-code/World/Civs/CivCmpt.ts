import { Entity, NComponent, NULL_ENTITY } from '0-engine';

export class CivCmpt extends NComponent {
  admin: Entity = NULL_ENTITY;

  towns: Entity[] = [];
}

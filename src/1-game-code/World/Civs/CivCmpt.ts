import { Entity, NComponent, NULL_ENTITY } from '0-engine';

export class CivCmpt extends NComponent {
  admin: Entity = NULL_ENTITY;
}

export class AffiliationsCmpt extends NComponent {
  civilizationId: Entity = NULL_ENTITY;
}

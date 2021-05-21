import { Entity, NComponent, NULL_ENTITY } from '0-engine';

/** Ideally this component would be broken down further but we'll try
 * batching some state for dev speed.
 */
export class TownCmpt extends NComponent {
  coords: [number, number] = [0, 0];

  civilizationId: Entity = NULL_ENTITY;

  population = 0;

  maxPopulation = 1000;
}

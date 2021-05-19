import { Entity, NComponent, NULL_ENTITY } from '0-engine';

/** Routes connect two towns */
export class RouteCmpt extends NComponent {
  townA: Entity = NULL_ENTITY;

  townB: Entity = NULL_ENTITY;

  paving: RoutePaving = RoutePaving.Untread;
}

enum RoutePaving {
  Untread = 0,
  Trail = 1,
  Paved = 2,
}

export function createRouteCmpt(townA: Entity, townB: Entity): RouteCmpt {
  const route = new RouteCmpt();
  route.townA = townA;
  route.townB = townB;
  return route;
}

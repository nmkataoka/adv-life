import { Entity } from '0-engine';
import { ComponentManager } from '0-engine/ECS/component-manager/ComponentManager';
import { RouteCmpt } from '1-game-code/Town/RouteCmpt';

/**
 * In order to keep data normalized, towns do not store references to their roads.
 * When we want to navigate from towns to roads, we need to build a graph.
 */
export function buildGraph(routeMgr: ComponentManager<RouteCmpt>): Map<Entity, Entity[]> {
  const townsToRoutes = new Map<Entity, Entity[]>();
  routeMgr.entities().forEach((routeId) => {
    const { townA, townB } = routeMgr.get(routeId);
    if (!townsToRoutes.has(townA)) {
      townsToRoutes.set(townA, []);
    }
    if (!townsToRoutes.has(townB)) {
      townsToRoutes.set(townB, []);
    }
    townsToRoutes.get(townA)?.push(routeId);
    townsToRoutes.get(townB)?.push(routeId);
  });
  return townsToRoutes;
}

export function forEachTown(
  firstTown: Entity,
  routeMgr: ComponentManager<RouteCmpt>,
  func: (townId: Entity) => void,
): void {
  const townsToRoutes = buildGraph(routeMgr);
  const townsToCheck = [firstTown];
  const visited = new Set<Entity>();
  visited.add(firstTown);
  while (townsToCheck.length > 0) {
    const townId = townsToCheck.pop() as Entity;
    const townRoutes = townsToRoutes.get(townId);
    if (!townRoutes) {
      throw new Error('Error associating towns with routes.');
    }
    townRoutes.forEach((routeId) => {
      const route = routeMgr.get(routeId);
      let nextTownId: Entity;
      if (route.townA === townId) {
        nextTownId = route.townB;
      } else {
        nextTownId = route.townA;
      }
      if (!visited.has(nextTownId)) {
        visited.add(nextTownId);
        townsToCheck.push(nextTownId);
      }
    });
    func(townId);
  }
}

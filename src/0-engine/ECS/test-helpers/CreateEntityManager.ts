import { EntityManager } from '../EntityManager';

// Creates an empty entity manager with no systems
// (by default, EntityManager constructor instantiates all registered systems)
export function createEmptyEntityManager(): EntityManager {
  return new EntityManager([]);
}

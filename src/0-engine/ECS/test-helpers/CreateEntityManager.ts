import { GameManager } from '0-engine/GameManager';
import { EntityManager } from '../EntityManager';

/** Creates an empty entity manager with no systems
 * (by default, EntityManager constructor instantiates all registered systems)
 */
export function createEmptyEntityManager(): EntityManager {
  return new EntityManager();
}

export async function createMockEntityManager(): Promise<EntityManager> {
  const gameMgr = new GameManager();
  await gameMgr.Start();
  const { eMgr } = gameMgr;
  return eMgr;
}

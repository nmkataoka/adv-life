import { ECSystem } from './ECSystem';
import { EntityManager } from '../EntityManager';

export interface ECSystemConstructor<C extends ECSystem> {
  new (eMgr: EntityManager): C;
}

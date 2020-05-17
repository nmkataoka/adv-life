import { ECSystem } from '../ECSystem';
import { GetComponentFuncType, GetComponentManagerFuncType } from './EntityManagerAccessorTypes';

export interface ECSystemConstructor<C extends ECSystem> {
  new (
    getComponent: GetComponentFuncType,
    getComponentManager: GetComponentManagerFuncType
  ): C;
}

export type ECSystemConstructorCFromCClass<CClass> = CClass extends ECSystemConstructor<infer C>
  ? C
  : never;

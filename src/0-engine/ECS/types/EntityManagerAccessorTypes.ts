import { NComponentConstructor, NComponentConstructorCFromCClass } from '../NComponent';
import { ComponentManager } from '../ComponentManager';

export type GetComponentFuncType = <
  CClass extends NComponentConstructor<C>,
  C = NComponentConstructorCFromCClass<CClass>
>(cclass: CClass, entityHandle: number) => C | undefined;

export type GetComponentManagerFuncType = <
  CClass extends NComponentConstructor<C>,
  C = NComponentConstructorCFromCClass<CClass>
>(cclass: CClass) => ComponentManager<C, CClass>;

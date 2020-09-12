import { NComponentConstructor } from '../NComponent';
import { ComponentManager } from '../ComponentManager';

export type GetComponentFuncType = <CClass extends NComponentConstructor<C>, C = InstanceType<CClass>>(
  cclass: CClass,
  entityHandle: number,
) => C;

export type GetComponentUncertainFuncType = <CClass extends NComponentConstructor<C>, C = InstanceType<CClass>>(
  cclass: CClass,
  entityHandle: number,
) => C | undefined;

export type GetComponentManagerFuncType = <CClass extends NComponentConstructor<C>, C = InstanceType<CClass>>(
  cclass: CClass,
) => ComponentManager<C, CClass>;

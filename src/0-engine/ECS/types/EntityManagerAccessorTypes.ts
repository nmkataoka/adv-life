import { NComponent, NComponentConstructor } from '../NComponent';
import { ComponentManager } from '../ComponentManager';

export type GetComponentFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
  entityHandle: number,
) => C;

export type GetComponentUncertainFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
  entityHandle: number,
) => C | undefined;

export type GetComponentManagerFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
) => ComponentManager<C>;

import { ECSystem } from '../ECSystem';
import {
  GetComponentFuncType,
  GetComponentManagerFuncType,
  GetComponentUncertainFuncType,
} from './EntityManagerAccessorTypes';

export interface ECSystemConstructor<C extends ECSystem> {
  new (
    getComponent: GetComponentFuncType,
    getComponentManager: GetComponentManagerFuncType,
    getComponentUncertain: GetComponentUncertainFuncType,
  ): C;
}

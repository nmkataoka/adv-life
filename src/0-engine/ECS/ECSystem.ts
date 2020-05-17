import {
  GetComponentFuncType,
  GetComponentManagerFuncType,
} from './types/EntityManagerAccessorTypes';

export abstract class ECSystem {
  public abstract Start(): void;

  public abstract OnUpdate(dt: number): void;

  constructor(
    getComponent: GetComponentFuncType,
    getComponentManager: GetComponentManagerFuncType,
  ) {
    this.GetComponent = getComponent;
    this.GetComponentManager = getComponentManager;
  }

  protected GetComponent: GetComponentFuncType;

  protected GetComponentManager: GetComponentManagerFuncType;
}

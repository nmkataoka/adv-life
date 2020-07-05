import {
  GetComponentFuncType,
  GetComponentManagerFuncType,
  GetComponentUncertainFuncType,
} from './types/EntityManagerAccessorTypes';

export abstract class ECSystem {
  public abstract Start(): void;

  public abstract OnUpdate(dt: number): void;

  constructor(
    getComponent: GetComponentFuncType,
    getComponentManager: GetComponentManagerFuncType,
    getComponentUncertain: GetComponentUncertainFuncType,
  ) {
    this.GetComponent = getComponent;
    this.GetComponentManager = getComponentManager;
    this.GetComponentUncertain = getComponentUncertain;
  }

  protected GetComponent: GetComponentFuncType;

  protected GetComponentManager: GetComponentManagerFuncType;

  protected GetComponentUncertain: GetComponentUncertainFuncType;
}

import {
  GetComponentFuncType,
  GetComponentManagerFuncType,
} from './types/EntityManagerAccessorTypes';

export abstract class ECSystem {
  public abstract Start(): void;

  public abstract OnUpdate(dt: number): void;

  constructor(
    getComponent: GetComponentFuncType<any, any>,
    getComponentManager: GetComponentManagerFuncType<any, any>,
  ) {
    this.GetComponent = getComponent;
    this.GetComponentManager = getComponentManager;
  }

  protected GetComponent: GetComponentFuncType<any, any>;

  protected GetComponentManager: GetComponentManagerFuncType<any, any>;
}

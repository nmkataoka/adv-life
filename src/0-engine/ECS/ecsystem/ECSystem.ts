import { EntityManager } from '../EntityManager';
import {
  GetComponentFuncType,
  GetComponentManagerFuncType,
  GetComponentUncertainFuncType,
} from '../types/EntityManagerAccessorTypes';

export abstract class ECSystem {
  public abstract Start(): void;

  public abstract OnUpdate(dt: number): void;

  constructor(eMgr: EntityManager) {
    this.eMgr = eMgr;
    this.GetComponent = eMgr.getCmptMut;
    this.GetComponentManager = eMgr.tryGetMgrMut;
    this.GetComponentUncertain = eMgr.tryGetCmptMut;
  }

  protected GetComponent: GetComponentFuncType;

  protected GetComponentManager: GetComponentManagerFuncType;

  protected GetComponentUncertain: GetComponentUncertainFuncType;

  protected eMgr: EntityManager;
}

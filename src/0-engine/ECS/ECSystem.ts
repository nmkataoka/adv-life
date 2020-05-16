import { EntityManager } from "./EntityManager";

export abstract class ECSystem {
  public abstract Start(): void;
  public abstract OnUpdate(dt: number): void;

  constructor(eMgr: EntityManager) {
    this.eMgr = eMgr;
  }
  protected eMgr: EntityManager;
}

export interface ECSystemConstructor<C extends ECSystem> {
  new (eMgr: EntityManager): C;
}

export type ECSystemConstructorCFromCClass<CClass> = CClass extends ECSystemConstructor<infer C>
  ? C
  : never;

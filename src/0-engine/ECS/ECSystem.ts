import { EntityManager } from "./EntityManager";

export abstract class ECSystem {
  public abstract Start(): void;
  public abstract OnUpdate(dt: number): void;

  constructor(eMgr: EntityManager, name: string) {
    this.eMgr = eMgr;
    this.name = name;
  }
  public readonly name: string;
  protected eMgr: EntityManager;
}
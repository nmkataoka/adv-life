import { EntityManager } from "./ECS/EntityManager";
import { HealthCmpt } from "../1- ncomponents/HealthCmpt";
import { CanAttackCmpt } from "../1- ncomponents/CanAttackCmpt";
import { WeaponCmpt } from "../1- ncomponents/WeaponCmpt";
import { FactionCmpt } from "../1- ncomponents/FactionCmpt";

export class GameManager {
  public static readonly FPS = 0.3;
  public static readonly dt = 1;
  public static readonly instance = new GameManager();

  public eMgr: EntityManager;

  constructor() {
    this.eMgr = new EntityManager();
  }

  public Start(): void {
    for (let i = 0; i < 3; ++i) {
      this.CreateUnit();
    }
    for (let i = 0; i < 3; ++i) {
      this.CreateUnit(true);
    }
    this.EnterGameLoop();
  }

  private GameLoopHandle?: NodeJS.Timeout;

  private CreateUnit(isEnemy = false): void {
    const e = this.eMgr.CreateEntity();
    this.eMgr.AddComponent(e, new HealthCmpt());
    this.eMgr.AddComponent(e, new CanAttackCmpt());
    this.eMgr.AddComponent(e, new WeaponCmpt());
    const faction = new FactionCmpt();
    faction.isEnemy = isEnemy;
    this.eMgr.AddComponent(e, faction);
  }

  private EnterGameLoop(): void {
    if (this.GameLoopHandle) {
      clearTimeout(this.GameLoopHandle);
    }

    this.GameLoopHandle = setTimeout(() => {
      this.eMgr.OnUpdate(GameManager.dt);
      this.EnterGameLoop();
    }, 1000 / GameManager.FPS);
  }
}

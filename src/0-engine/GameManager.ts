import { EntityManager } from "./ECS/EntityManager";
import { HealthCmpt } from "../1- ncomponents/HealthCmpt";
import { CanAttackCmpt } from "../1- ncomponents/CanAttackCmpt";
import { WeaponCmpt } from "../1- ncomponents/WeaponCmpt";
import { FactionCmpt } from "../1- ncomponents/FactionCmpt";
import { CombatPositionCmpt } from "../1- ncomponents/CombatPositionCmpt";
import { CombatStatsCmpt } from "../1- ncomponents/CombatStatsCmpt";

export class GameManager {
  public static readonly FPS = 0.3;
  public static readonly dt = 1;
  public static readonly instance = new GameManager();

  public eMgr: EntityManager;
  public isPaused = false;

  constructor() {
    this.eMgr = new EntityManager();
  }

  public Start(): void {
    for (let i = 0; i < 3; ++i) {
      this.CreateUnit(i);
    }
    for (let i = 0; i < 3; ++i) {
      this.CreateUnit(i, true);
    }
    this.EnterGameLoop();
  }

  public SetPaused(nextState: boolean): void {
    this.isPaused = nextState;
  }

  private GameLoopHandle?: NodeJS.Timeout;

  private CreateUnit(position: number, isEnemy = false): void {
    const e = this.eMgr.CreateEntity();
    this.eMgr.AddComponent(e, new HealthCmpt());
    this.eMgr.AddComponent(e, new CombatStatsCmpt());
    this.eMgr.AddComponent(e, new CanAttackCmpt());
    this.eMgr.AddComponent(e, new WeaponCmpt());
    const combatPos = new CombatPositionCmpt();
    combatPos.position = position;
    this.eMgr.AddComponent(e, combatPos);
    const faction = new FactionCmpt();
    faction.isEnemy = isEnemy;
    this.eMgr.AddComponent(e, faction);
  }

  private EnterGameLoop(): void {
    if (this.GameLoopHandle) {
      clearTimeout(this.GameLoopHandle);
    }

    this.GameLoopHandle = setTimeout(() => {
      if (!this.isPaused) {
        this.eMgr.OnUpdate(GameManager.dt);
      }

      this.EnterGameLoop();
    }, 1000 / GameManager.FPS);
  }
}

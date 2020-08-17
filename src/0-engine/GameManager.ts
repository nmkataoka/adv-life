import { EntityManager } from './ECS/EntityManager';
import { HealthCmpt } from '../1- ncomponents/HealthCmpt';
import { CanAttackCmpt } from '../1- ncomponents/CanAttackCmpt';
import { FactionCmpt } from '../1- ncomponents/FactionCmpt';
import { CombatPositionCmpt } from '../1- ncomponents/CombatPositionCmpt';
import { CombatStatsCmpt } from '../1- ncomponents/CombatStatsCmpt';
import { AgentCmpt } from '../1- ncomponents/AgentCmpt';
import { GoalQueueCmpt } from '../2-ecsystems/Agent/GoalQueueCmpt';
import { StatusEffectsCmpt } from '../1- ncomponents/StatusEffectsCmpt';
import SystemList from './SystemList';
import { InventoryCmpt } from '../1- ncomponents/InventoryCmpt';

export class GameManager {
  public static readonly FPS = 3;

  public static readonly dt = 1 / GameManager.FPS;

  public static readonly instance = new GameManager();

  public eMgr: EntityManager;

  public isPaused = false;

  constructor() {
    this.RegisterSystems();
    this.eMgr = new EntityManager();
  }

  public Start(): void {
    this.eMgr.Start();
    this.CreateUnits();
    this.EnterGameLoop();
  }

  public SetPaused(nextState: boolean): void {
    this.isPaused = nextState;
  }

  private RegisterSystems(): void {
    EntityManager.SystemConstructors = SystemList;
  }

  private GameLoopHandle?: NodeJS.Timeout;

  private CreateUnits(): void {
    for (let i = 0; i < 3; ++i) {
      this.CreateUnit(i);
    }
    for (let i = 0; i < 3; ++i) {
      this.CreateUnit(i, true);
    }
  }

  private CreateUnit(position: number, isEnemy = false): void {
    const e = this.eMgr.CreateEntity();
    this.eMgr.AddComponent(e, new HealthCmpt());
    this.eMgr.AddComponent(e, new CombatStatsCmpt());
    this.eMgr.AddComponent(e, new CanAttackCmpt());
    this.eMgr.AddComponent(e, new InventoryCmpt());
    this.eMgr.AddComponent(e, new AgentCmpt());
    this.eMgr.AddComponent(e, new StatusEffectsCmpt());
    if (!isEnemy) {
      this.eMgr.AddComponent(e, new GoalQueueCmpt());
    }
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

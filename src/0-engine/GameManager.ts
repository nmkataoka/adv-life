import { EntityManager } from './ECS/EntityManager';
import { createUnit } from '../1-game-code/ecsystems/Unit/createUnit';
import ControllerList from './ControllerList';
import SystemList from './SystemList';
import { createTown } from '../1-game-code/ecsystems/Town/createTown';
import { Router } from './API/Router';
import { EventSys } from './ECS/EventSys';

export class GameManager {
  public static readonly FPS = 3;

  public static readonly dt = 1 / GameManager.FPS;

  public static readonly instance = new GameManager();

  public eMgr: EntityManager;

  public router: Router;

  public isPaused = false;

  constructor() {
    this.eMgr = new EntityManager(SystemList);
    this.router = new Router(ControllerList);
  }

  public Start(): void {
    this.eMgr.Start();
    this.router.Start(this.eMgr.GetSystem(EventSys));
    this.CreateMap();
    this.CreateUnits();
    this.EnterGameLoop();
  }

  public SetPaused(nextState: boolean): void {
    this.isPaused = nextState;
  }

  private GameLoopHandle?: NodeJS.Timeout;

  private CreateUnits(): void {
    for (let i = 0; i < 3; ++i) {
      createUnit(i);
    }
    for (let i = 0; i < 3; ++i) {
      createUnit(i, true);
    }
  }

  private CreateMap(): void {
    createTown('Quietwater');
    createTown('Wandermere');
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

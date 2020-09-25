import { createUnit } from '1-game-code/Unit/createUnit';
import { createTown } from '1-game-code/Town/createTown';
import { EntityManager } from './ECS/EntityManager';
import ControllerList from './ControllerList';
import SystemList from './SystemList';
import { RequestData, Router } from './API/Router';
import { EventSys } from './ECS/event-system/EventSys';

export type StoreSubscriber = (eMgr: EntityManager) => void;

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
    this.storeSubscribers = new Set();
  }

  public Start(): void {
    this.eMgr.Start();
    this.router.Start(this.eMgr.getSys(EventSys));
    this.CreateMap();
    this.CreateUnits();
    this.EnterGameLoop();
  }

  /** Dispatch an event.
   * Don't confuse this with the lower-level DispatchEvent on EntityManager.
   */
  public dispatch = <Data>(routeName: string, data: RequestData<Data>): void => {
    this.router.handleRequest(routeName, data);
  };

  public SetPaused(nextState: boolean): void {
    this.isPaused = nextState;
  }

  /** Register a callback to be called at the end of each tick
   * @returns A callback used to unsubscribe
   */
  public subscribe(callback: StoreSubscriber): () => void {
    this.storeSubscribers.add(callback);
    return () => {
      this.storeSubscribers.delete(callback);
    };
  }

  private GameLoopHandle?: NodeJS.Timeout;

  private storeSubscribers: Set<StoreSubscriber>;

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

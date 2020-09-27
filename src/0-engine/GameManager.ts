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
    // expose gamemanager on window for debugging
    if (process.env.NODE_ENV === 'development' && window) {
      // eslint-disable-next-line
      // @ts-ignore
      window.gameManager = this;
    }
    this.eMgr = new EntityManager(SystemList);
    this.router = new Router(ControllerList);
    this.storeSubscribers = new Set();
  }

  public Start(): void {
    this.eMgr.Start();
    this.router.Start(this.eMgr.getSys(EventSys));
    this.createMap();
    this.createUnits();
    this.enterGameLoop();
  }

  /** Dispatch an event.
   * Don't confuse this with the lower-level DispatchEvent on EntityManager.
   */
  public dispatch = <Data>(routeName: string, data: RequestData<Data>): void => {
    this.router.handleRequest(routeName, data);
  };

  public setPaused(nextState: boolean): void {
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

  private gameLoopHandle?: NodeJS.Timeout;

  private storeSubscribers: Set<StoreSubscriber>;

  private createUnits(): void {
    for (let i = 0; i < 3; ++i) {
      createUnit(i);
    }
    for (let i = 0; i < 3; ++i) {
      createUnit(i, true);
    }
  }

  private createMap(): void {
    createTown('Quietwater');
    createTown('Wandermere');
  }

  private notifySubscribers = (): void => {
    this.storeSubscribers.forEach((subscriber) => {
      subscriber(this.eMgr);
    });
  };

  private enterGameLoop(): void {
    if (this.gameLoopHandle) {
      clearTimeout(this.gameLoopHandle);
    }

    this.gameLoopHandle = setTimeout(() => {
      if (!this.isPaused) {
        this.eMgr.OnUpdate(GameManager.dt);
        this.notifySubscribers();
      }

      this.enterGameLoop();
    }, 1000 / GameManager.FPS);
  }
}

import { createUnit } from '1-game-code/Unit/createUnit';
import { createTown } from '1-game-code/Town/createTown';
import eventListeners from '1-game-code/eventListeners';
import { EntityManager } from './ECS/EntityManager';

export class GameManager {
  public static readonly FPS = 3;

  public static readonly dt = 1 / GameManager.FPS;

  public static readonly instance = new GameManager();

  public eMgr: EntityManager;

  public isPaused = false;

  constructor() {
    // expose gamemanager on window for debugging
    if (process.env.NODE_ENV === 'development' && window) {
      // eslint-disable-next-line
      // @ts-ignore
      window.gameManager = this;
    }
    this.eMgr = new EntityManager();
    this.registerListeners();
  }

  private registerListeners(): void {
    eventListeners.forEach((listener) => {
      this.eMgr.registerEventListener(listener.eventType, listener);
    });
  }

  public async Start(): Promise<void> {
    await this.eMgr.Start();

    // This is game logic that should be separated from the engine stuff like the game loop
    this.createMap();
    this.createUnits();
    this.enterGameLoop();
  }

  public setPaused(nextState: boolean): void {
    this.isPaused = nextState;
  }

  private gameLoopHandle?: NodeJS.Timeout;

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

  private enterGameLoop(): void {
    if (this.gameLoopHandle) {
      clearTimeout(this.gameLoopHandle);
    }

    this.gameLoopHandle = setTimeout(() => {
      if (!this.isPaused) {
        void this.eMgr.OnUpdate(GameManager.dt).then(() => {
          this.enterGameLoop();
          this.eMgr.notifySubscribers();
        });
      } else {
        this.enterGameLoop();
      }
    }, 1000 / GameManager.FPS);
  }
}

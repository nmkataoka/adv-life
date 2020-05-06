import {Entity} from './Entity';
import { ECSystem } from './ECSystem';

export class EntityManager {
  public static readonly MAX_ENTITIES = Number.MAX_SAFE_INTEGER;

  private count = 0;
  private nextEntityId = 0;
  private systems: {[key: string]: ECSystem};

  constructor() {
    this.systems = {};
  }

  public OnUpdate(dt: number): void {
    Object.values(this.systems).forEach(s => s.OnUpdate(dt));
  }

  public CreateEntity(): Entity {
    if(this.count === EntityManager.MAX_ENTITIES) {
      throw new Error('Used all available entities');
    }

    this.IncrementNextEntityId();
    const e = new Entity(this.nextEntityId);
    ++this.count;
    return e;
  }

  private IncrementNextEntityId(): void {
    ++this.nextEntityId;
  }
}
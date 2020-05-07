import {Entity} from './Entity';
import { ECSystem } from './ECSystem';
import { NComponent, NComponentConstructor } from './NComponent';
import { ComponentManager } from './ComponentManager';

export class EntityManager {
  public static readonly MAX_ENTITIES = Number.MAX_SAFE_INTEGER;

  private count = 0;
  private nextEntityId = 0;
  private systems: {[key: string]: ECSystem};
  private cMgrs: {[key: string]: ComponentManager<NComponent, NComponentConstructor<NComponent>>};

  constructor() {
    this.systems = {};
    this.cMgrs = {};
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

  public GetComponentManager<C extends NComponent, CClass extends NComponentConstructor<C>>(c: C): ComponentManager<C, CClass> {
    const classTemp = c.constructor as CClass;
    const cName = classTemp.name;
    let cMgr = this.cMgrs[cName];

    // Create componentManager if it doesn't exist
    if(!cMgr) {
      cMgr = new ComponentManager<C, CClass>(classTemp);
      this.cMgrs[cName] = cMgr;
    }
    return cMgr as ComponentManager<C, CClass>;
  }

  public AddComponent<C extends NComponent, CClass extends NComponentConstructor<C>>(e: Entity, c: C): void {
    const cMgr = this.GetComponentManager<C, CClass>(c);
    cMgr.Add(e);
  }

  private IncrementNextEntityId(): void {
    ++this.nextEntityId;
  }
}
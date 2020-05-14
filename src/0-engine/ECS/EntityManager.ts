import { Entity } from "./Entity";
import { ECSystem, ECSystemConstructor } from "./ECSystem";
import { NComponent, NComponentConstructor, NComponentConstructorCFromCClass } from "./NComponent";
import { ComponentManager } from "./ComponentManager";
import { AttackSys } from "../../2-ecsystems/AttackSys";
import { ManaRegenSys } from "../../2-ecsystems/ManaRegenSys";

const systems: ECSystemConstructor[] = [AttackSys, ManaRegenSys];

export class EntityManager {
  public static readonly MAX_ENTITIES = Number.MAX_SAFE_INTEGER;

  private count = 0;
  private nextEntityId = 0;
  private systems: { [key: string]: ECSystem };
  private cMgrs: { [key: string]: ComponentManager<NComponent, NComponentConstructor<NComponent>> };
  private entitiesToDestroy: (Entity | number)[] = [];

  constructor() {
    this.systems = {};
    systems.forEach((S) => {
      this.systems[S.name] = new S(this);
    });

    this.cMgrs = {};
  }

  public Start(): void {
    Object.values(this.systems).forEach((s) => s.Start());
  }

  public OnUpdate(dt: number): void {
    Object.values(this.systems).forEach((s) => s.OnUpdate(dt));
    this.DestroyQueuedEntities();
  }

  public CreateEntity(): Entity {
    if (this.count === EntityManager.MAX_ENTITIES) {
      throw new Error("Used all available entities");
    }

    this.IncrementNextEntityId();
    const e = new Entity(this.nextEntityId);
    ++this.count;
    return e;
  }

  public GetComponentManager<
    CClass extends NComponentConstructor<C>,
    C = NComponentConstructorCFromCClass<CClass>
  >(c: CClass): ComponentManager<C, CClass> {
    let cMgr = this.cMgrs[c.name];

    // Create componentManager if it doesn't exist
    if (!cMgr) {
      cMgr = new ComponentManager<C, CClass>(c);
      this.cMgrs[c.name] = cMgr;
    }
    return cMgr as ComponentManager<C, CClass>;
  }

  public AddComponent<C extends NComponent, CClass extends NComponentConstructor<C>>(
    e: Entity,
    c: C
  ): void {
    const cMgr = this.GetComponentManager<CClass, C>(c.constructor as CClass);
    cMgr.Add(e, c);
  }

  public QueueEntityDestruction(e: Entity | number) {
    this.entitiesToDestroy.push(e);
  }

  private DestroyQueuedEntities() {
    this.entitiesToDestroy.forEach((e) => {
      this.DestroyEntity(e);
    });
    this.entitiesToDestroy = [];
  }

  private DestroyEntity(e: number | Entity) {
    // Multiple destroy requests for an entity may occur in one frame
    // TODO: implement when add tracking for deleted entities

    // Destroy all related components
    Object.values(this.cMgrs).forEach((cMgr) => cMgr.Erase(e));
  }

  private IncrementNextEntityId(): void {
    ++this.nextEntityId;
  }
}

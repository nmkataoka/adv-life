import { Entity } from './Entity';
import { ECSystem } from './ECSystem';
import { NComponent, NComponentConstructor, NComponentConstructorCFromCClass } from './NComponent';
import { ComponentManager } from './ComponentManager';
import { ECSystemConstructor, ECSystemConstructorCFromCClass } from './types/ECSystemTypes';

export class EntityManager {
  public static readonly MAX_ENTITIES = Number.MAX_SAFE_INTEGER;

  public static instance: EntityManager;

  public static SystemConstructors: ECSystemConstructor<any>[] = [];

  private count = 0;

  private nextEntityId = 0;

  private systems: { [key: string]: ECSystem };

  private cMgrs: { [key: string]: ComponentManager<NComponent, NComponentConstructor<NComponent>> };

  private entitiesToDestroy: (Entity | number)[] = [];

  constructor() {
    EntityManager.instance = this;

    this.systems = {};
    EntityManager.SystemConstructors.forEach((S) => {
      this.systems[S.name] = new S(GetComponent, GetComponentManager);
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
      throw new Error('Used all available entities');
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

  public GetComponent<
    CClass extends NComponentConstructor<C>,
    C = NComponentConstructorCFromCClass<CClass>
  >(cclass: CClass, entityHandle: number): C | undefined {
    const cMgr = this.GetComponentManager<CClass, C>(cclass);
    return cMgr.GetByNumber(entityHandle);
  }

  public AddComponent<C extends NComponent, CClass extends NComponentConstructor<C>>(
    e: Entity,
    c: C,
  ): void {
    const cMgr = this.GetComponentManager<CClass, C>(c.constructor as CClass);
    cMgr.Add(e, c);
  }

  public GetSystem<
    CClass extends ECSystemConstructor<C>,
    C extends ECSystem = ECSystemConstructorCFromCClass<CClass>
  >(cclass: CClass): C {
    return this.systems[cclass.name] as C;
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

export function GetComponentManager<
  CClass extends NComponentConstructor<C>,
  C = NComponentConstructorCFromCClass<CClass>
>(cclass: CClass): ComponentManager<C, CClass> {
  return EntityManager.instance.GetComponentManager<CClass, C>(cclass);
}

export function GetComponent<
  CClass extends NComponentConstructor<C>,
  C = NComponentConstructorCFromCClass<CClass>
>(cclass: CClass, entity: number): C | undefined {
  return EntityManager.instance.GetComponentManager<CClass, C>(cclass).GetByNumber(entity);
}

export function GetSystem<
  CClass extends ECSystemConstructor<C>,
  C extends ECSystem = ECSystemConstructorCFromCClass<CClass>
>(cclass: CClass): C {
  return EntityManager.instance.GetSystem(cclass);
}

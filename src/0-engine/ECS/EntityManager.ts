import { ECSystem } from './ECSystem';
import { NComponent, NComponentConstructor } from './NComponent';
import { ComponentManager } from './ComponentManager';
import { ECSystemConstructor } from './types/ECSystemTypes';
import {
  GetComponentFuncType,
  GetComponentManagerFuncType,
  GetComponentUncertainFuncType,
} from './types/EntityManagerAccessorTypes';
import { NameCmpt } from './built-in-components';

export class EntityManager {
  public static readonly MAX_ENTITIES = Number.MAX_SAFE_INTEGER;

  public static instance: EntityManager;

  private count = 0;

  private nextEntityId = 0;

  private systems: { [key: string]: ECSystem };

  private cMgrs: { [key: string]: ComponentManager<NComponent, NComponentConstructor<NComponent>> };

  private entitiesToDestroy: number[] = [];

  // For testing purposes, specific systems can be passed
  constructor(systemConstructors: ECSystemConstructor<any>[]) {
    EntityManager.instance = this;

    this.systems = {};

    const systemsToCreate = systemConstructors;
    const createSystem = (S: ECSystemConstructor<any>) => {
      this.systems[S.name] = new S(this);
    };
    systemsToCreate.forEach(createSystem);

    this.cMgrs = {};
  }

  public Start(): void {
    Object.values(this.systems).forEach((s) => s.Start());
  }

  public OnUpdate(dt: number): void {
    Object.values(this.systems).forEach((s) => s.OnUpdate(dt));
    this.DestroyQueuedEntities();
  }

  public CreateEntity(name?: string): number {
    if (this.count === EntityManager.MAX_ENTITIES) {
      throw new Error('Used all available entities');
    }

    this.IncrementNextEntityId();
    const e = this.nextEntityId;
    ++this.count;

    if (name) {
      const nameCmpt = new NameCmpt();
      nameCmpt.name = name;
      this.AddComponent(e, nameCmpt);
    }

    return e;
  }

  public GetComponentManager = <CClass extends NComponentConstructor<C>, C = InstanceType<CClass>>(
    c: CClass,
  ): ComponentManager<C, CClass> => {
    let cMgr = this.cMgrs[c.name];

    // Create componentManager if it doesn't exist
    if (!cMgr) {
      cMgr = new ComponentManager<C, CClass>(c);
      this.cMgrs[c.name] = cMgr;
    }
    return cMgr as ComponentManager<C, CClass>;
  };

  public GetComponent = <CClass extends NComponentConstructor<C>, C = InstanceType<CClass>>(
    cclass: CClass,
    entityHandle: number,
  ): C => {
    const cMgr = this.GetComponentManager<CClass, C>(cclass);
    return cMgr.GetByNumber(entityHandle);
  };

  public GetComponentUncertain = <
    CClass extends NComponentConstructor<C>,
    C = InstanceType<CClass>
  >(
    cclass: CClass,
    entityHandle: number,
  ): C | undefined => {
    const cMgr = this.GetComponentManager<CClass, C>(cclass);
    return cMgr.GetByNumberUncertain(entityHandle);
  };

  public GetUniqueComponent = <CClass extends NComponentConstructor<C>, C = InstanceType<CClass>>(
    cclass: CClass,
  ): C => {
    const cMgr = this.GetComponentManager<CClass, C>(cclass);
    const components = Object.values(cMgr.components);
    return components[0];
  };

  public AddComponent<C extends NComponent, CClass extends NComponentConstructor<C>>(
    e: number,
    c: C,
  ): void {
    const cMgr = this.GetComponentManager<CClass, C>(c.constructor as CClass);
    cMgr.Add(e, c);
  }

  public GetSystem<
    CClass extends ECSystemConstructor<C>,
    C extends ECSystem = InstanceType<CClass>
  >(cclass: CClass): C {
    return this.systems[cclass.name] as C;
  }

  public QueueEntityDestruction(e: number): void {
    this.entitiesToDestroy.push(e);
  }

  private DestroyQueuedEntities() {
    this.entitiesToDestroy.forEach((e) => {
      this.DestroyEntity(e);
    });
    this.entitiesToDestroy = [];
  }

  private DestroyEntity(e: number) {
    // Multiple destroy requests for an entity may occur in one frame
    // TODO: implement when add tracking for deleted entities

    // Destroy all related components
    Object.values(this.cMgrs).forEach((cMgr) => cMgr.Erase(e));
  }

  private IncrementNextEntityId(): void {
    ++this.nextEntityId;
  }
}

/** @deprecated Avoid global accessor functions */
export const GetComponentManager: GetComponentManagerFuncType = <
  CClass extends NComponentConstructor<C>,
  C = InstanceType<CClass>
>(
  cclass: CClass,
): ComponentManager<C, CClass> => EntityManager.instance.GetComponentManager<CClass, C>(cclass);

/** @deprecated Avoid global accessor functions */
export const GetComponent: GetComponentFuncType = <
  CClass extends NComponentConstructor<C>,
  C = InstanceType<CClass>
>(
  cclass: CClass,
  entity: number,
): C => EntityManager.instance.GetComponentManager<CClass, C>(cclass).GetByNumber(entity);

/** @deprecated Avoid global accessor functions */
export const GetComponentUncertain: GetComponentUncertainFuncType = <
  CClass extends NComponentConstructor<C>,
  C = InstanceType<CClass>
>(
  cclass: CClass,
  entity: number,
): C | undefined =>
  EntityManager.instance.GetComponentManager<CClass, C>(cclass).GetByNumberUncertain(entity);

/** @deprecated Avoid global accessor functions */
export function GetSystem<
  CClass extends ECSystemConstructor<C>,
  C extends ECSystem = InstanceType<CClass>
>(cclass: CClass): C {
  return EntityManager.instance.GetSystem(cclass);
}

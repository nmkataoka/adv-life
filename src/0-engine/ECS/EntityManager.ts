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

  private cMgrs: { [key: string]: ComponentManager<NComponent> };

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
      const nameCmpt = this.AddComponent(e, NameCmpt);
      nameCmpt.name = name;
    }

    return e;
  }

  public GetComponentManager = <C extends NComponent>(
    c: NComponentConstructor<C>,
  ): ComponentManager<C> => {
    let cMgr = this.cMgrs[c.name];

    // Create componentManager if it doesn't exist
    if (!cMgr) {
      cMgr = new ComponentManager<C>(c);
      this.cMgrs[c.name] = cMgr;
    }
    return cMgr as ComponentManager<C>;
  };

  public GetComponent = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
    entityHandle: number,
  ): C => {
    const cMgr = this.GetComponentManager<C>(cclass);
    return cMgr.getMut(entityHandle);
  };

  public GetComponentUncertain = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
    entityHandle: number,
  ): C | undefined => {
    const cMgr = this.GetComponentManager<C>(cclass);
    return cMgr.tryGetMut(entityHandle);
  };

  public GetUniqueComponent = <C extends NComponent>(cclass: NComponentConstructor<C>): C => {
    const cMgr = this.GetComponentManager<C>(cclass);
    const components = Object.values(cMgr.components);
    return components[0];
  };

  public AddComponent<C extends NComponent>(
    e: number,
    CClass: NComponentConstructor<C>,
    ...constructorArgs: any[]
  ): C {
    const cMgr = this.GetComponentManager<C>(CClass);
    return cMgr.add(e, ...constructorArgs);
  }

  public GetSystem<Sys extends ECSystem>(sysClass: ECSystemConstructor<Sys>): Sys {
    return this.systems[sysClass.name] as Sys;
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
    Object.values(this.cMgrs).forEach((cMgr) => cMgr.remove(e));
  }

  private IncrementNextEntityId(): void {
    ++this.nextEntityId;
  }
}

/** @deprecated Avoid global accessor functions */
export const GetComponentManager: GetComponentManagerFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
): ComponentManager<C> => EntityManager.instance.GetComponentManager<C>(cclass);

/** @deprecated Avoid global accessor functions */
export const GetComponent: GetComponentFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
  entity: number,
): C => EntityManager.instance.GetComponentManager<C>(cclass).getMut(entity);

/** @deprecated Avoid global accessor functions */
export const GetComponentUncertain: GetComponentUncertainFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
  entity: number,
): C | undefined => EntityManager.instance.GetComponentManager<C>(cclass).tryGetMut(entity);

/** @deprecated Avoid global accessor functions */
export function GetSystem<Sys extends ECSystem>(sysClass: ECSystemConstructor<Sys>): Sys {
  return EntityManager.instance.GetSystem(sysClass);
}

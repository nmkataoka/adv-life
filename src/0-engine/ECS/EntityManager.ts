import { DeepReadonly } from 'ts-essentials';
import { ECSystem, ECSystemConstructor } from './ecsystem';
import { NComponent, NComponentConstructor } from './NComponent';
import { ComponentManager } from './ComponentManager';
import {
  GetComponentFuncType,
  GetComponentManagerFuncType,
  GetComponentUncertainFuncType,
} from './types/EntityManagerAccessorTypes';
import { NameCmpt } from './built-in-components';
import { View } from './View';
import { ComponentClasses, ComponentManagers } from './ComponentDependencies';

export class EntityManager {
  public static readonly MAX_ENTITIES = Number.MAX_SAFE_INTEGER;

  public static instance: EntityManager;

  private count = 0;

  private nextEntityId = 0;

  private systems: { [key: string]: ECSystem };

  private cMgrs: { [key: string]: ComponentManager<NComponent> };

  private entitiesToDestroy: (number | string)[] = [];

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
    this.destroyQueuedEntities();
  }

  /** Creates and returns a new entity. If a `name` string is passed, will also create an associated `NameCmpt`. */
  public createEntity(name?: string): number {
    if (this.count === EntityManager.MAX_ENTITIES) {
      throw new Error('Used all available entities');
    }

    this.incrementNextEntityId();
    const e = this.nextEntityId;
    ++this.count;

    if (name) {
      const nameCmpt = new NameCmpt();
      nameCmpt.name = name;
      this.addCmpt(e, nameCmpt);
    }

    return e;
  }

  /** Returns a readonly reference to a component manager, which must exist. */
  public getMgr = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
  ): DeepReadonly<ComponentManager<C>> => {
    return this.getMgrMut(cclass) as DeepReadonly<ComponentManager<C>>;
  };

  /** Returns a mutable reference to a component manager, which must exist. */
  public getMgrMut = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
  ): ComponentManager<C> => {
    return this.cMgrs[cclass.name] as ComponentManager<C>;
  };

  /** Returns a readonly reference to a component manager, which is created if it doesn't already exist. */
  public tryGetMgr = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
  ): DeepReadonly<ComponentManager<C>> => {
    return this.tryGetMgrMut(cclass) as DeepReadonly<ComponentManager<C>>;
  };

  /** Returns a mutable reference to a component manager, which is created if it doesn't already exist. */
  public tryGetMgrMut = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
  ): ComponentManager<C> => {
    let cMgr = this.cMgrs[cclass.name];

    // Create componentManager if it doesn't exist
    if (!cMgr) {
      cMgr = new ComponentManager<C>(cclass);
      this.cMgrs[cclass.name] = cMgr;
    }
    return cMgr as ComponentManager<C>;
  };

  /** Returns a readonly reference to a component, which must exist. */
  public getCmpt = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
    e: number | string,
  ): DeepReadonly<C> => {
    const cMgr = this.tryGetMgr(cclass);
    return cMgr.get(e);
  };

  /** Returns a mutable reference to a component, which must exist. */
  public getCmptMut = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
    entityHandle: number | string,
  ): C => {
    const cMgr = this.tryGetMgrMut<C>(cclass);
    return cMgr.getMut(entityHandle);
  };

  /** Returns a readonly reference to a component, or undefined if it doesn't exist. */
  public tryGetCmpt = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
    entityHandle: number | string,
  ): DeepReadonly<C> | undefined => {
    const cMgr = this.tryGetMgr<C>(cclass);
    return cMgr.tryGet(entityHandle);
  };

  /** Returns a mutable reference to a component, or undefined if it doesn't exist. */
  public tryGetCmptMut = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
    entityHandle: number | string,
  ): C | undefined => {
    const cMgr = this.tryGetMgrMut<C>(cclass);
    return cMgr.tryGetMut(entityHandle);
  };

  /** Gets a unique component, readonly. Convenenience function for special components like lookup tables. */
  public getUniqueCmpt = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
  ): DeepReadonly<C> => {
    const cMgr = this.tryGetMgr<C>(cclass);
    const components = Object.values(cMgr.components);
    return components[0];
  };

  /** Gets a unique component, mutable. Convenenience function for special components like lookup tables. */
  public getUniqueCmptMut = <C extends NComponent>(cclass: NComponentConstructor<C>): C => {
    const cMgr = this.tryGetMgrMut<C>(cclass);
    const components = Object.values(cMgr.components);
    return components[0];
  };

  /** Creates a component, adds it to an entity, and returns it. */
  public addCmpt<C extends NComponent>(e: number, cmpt: C): void {
    const cMgr = this.tryGetMgrMut<C>(cmpt.constructor as NComponentConstructor<C>);
    cMgr.add(e, cmpt);
  }

  public getSys<Sys extends ECSystem>(sysClass: ECSystemConstructor<Sys>): Sys {
    return this.systems[sysClass.name] as Sys;
  }

  public getView = <
    ReadCmpts extends NComponent[] = [],
    WriteCmpts extends NComponent[] = [],
    WithoutCmpts extends NComponent[] = []
  >(
    componentDependencies: ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>,
    componentManagers?: ComponentManagers<ReadCmpts, WriteCmpts, WithoutCmpts>,
  ): View<ReadCmpts, WriteCmpts, WithoutCmpts> => {
    const view = new View(this, componentDependencies, componentManagers);
    return view;
  };

  public queueEntityDestruction(e: number | string): void {
    this.entitiesToDestroy.push(e);
  }

  private destroyQueuedEntities() {
    this.entitiesToDestroy.forEach((e) => {
      this.destroyEntity(e);
    });
    this.entitiesToDestroy = [];
  }

  private destroyEntity(e: number | string) {
    // Multiple destroy requests for an entity may occur in one frame -- is this an issue?
    // We could at least optimizely when we add tracking for deleted entities.
    Object.values(this.cMgrs).forEach((cMgr) => cMgr.remove(e));
  }

  private incrementNextEntityId(): void {
    ++this.nextEntityId;
  }
}

/** @deprecated Avoid global accessor functions */
export const GetComponentManager: GetComponentManagerFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
): ComponentManager<C> => EntityManager.instance.tryGetMgrMut<C>(cclass);

/** @deprecated Avoid global accessor functions */
export const GetComponent: GetComponentFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
  entity: number,
): C => EntityManager.instance.tryGetMgrMut<C>(cclass).getMut(entity);

/** @deprecated Avoid global accessor functions */
export const GetComponentUncertain: GetComponentUncertainFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
  entity: number,
): C | undefined => EntityManager.instance.tryGetMgrMut<C>(cclass).tryGetMut(entity);

/** @deprecated Avoid global accessor functions */
export function GetSystem<Sys extends ECSystem>(sysClass: ECSystemConstructor<Sys>): Sys {
  return EntityManager.instance.getSys(sysClass);
}

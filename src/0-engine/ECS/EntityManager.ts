import { DeepReadonly } from 'ts-essentials';
import { NComponent, NComponentConstructor } from './NComponent';
import { ComponentManager, ReadonlyComponentManager } from './component-manager/ComponentManager';
import { NameCmpt } from './built-in-components';
import { View } from './view/View';
import {
  AbstractComponentClasses,
  ComponentManagersFromClasses,
} from './component-dependencies/ComponentDependencies';
import { Dispatch, EventAction, EventSys } from './event-system';
import { Thunk } from './Thunk';
import { EventListener } from './event-system/EventListener';
import { Entity } from './Entity';

export type StoreSubscriber = (eMgr: EntityManager) => void;

export class EntityManager {
  public static readonly MAX_ENTITIES = Number.MAX_SAFE_INTEGER;

  public static instance: EntityManager;

  private count = 0;

  private eventSys: EventSys;

  private nextEntityId = 0;

  private cMgrs: { [key: string]: ComponentManager<NComponent> };

  private entitiesToDestroy: Entity[] = [];

  private storeSubscribers: Set<StoreSubscriber>;

  constructor() {
    EntityManager.instance = this;
    this.cMgrs = {};
    this.eventSys = new EventSys(this);
    this.storeSubscribers = new Set();
  }

  public async Start(): Promise<void> {
    await this.eventSys.Start();
  }

  // TODO: This OnUpdate should be fully coded as a dispatch default event
  public async OnUpdate(dt: number): Promise<void> {
    await this.eventSys.OnUpdate(dt);
    this.destroyQueuedEntities();
  }

  // TODO: This should be coded as a dispatch default event
  /** Warning! All unsaved anything will be lost */
  public async restart(): Promise<void> {
    this.cMgrs = {};
    await this.Start();
  }

  public registerEventListener<Payload, ComponentDependencies extends AbstractComponentClasses>(
    eventName: string,
    listener: EventListener<Payload, ComponentDependencies>,
  ): void {
    this.eventSys.RegisterListener(eventName, listener);
  }

  // This really ought to be implemented as middleware, but that's too much effort
  public dispatch = <Payload>(action: Thunk | EventAction<Payload>): Promise<void> => {
    if (typeof action === 'function') {
      return action(this.dispatch, this);
    }
    return this.originalDispatch(action);
  };

  /** If middlewares are applied, this stores a copy of the lowest, no-middleware dispatch */
  private originalDispatch: Dispatch = async (...args) => this.eventSys.dispatch(...args);

  /** Register a callback to be called at the end of each tick
   * @returns A callback used to unsubscribe
   */
  public subscribe(callback: StoreSubscriber): () => void {
    this.storeSubscribers.add(callback);
    return () => {
      this.storeSubscribers.delete(callback);
    };
  }

  /** Triggers an update to all subscribers.
   * E.g. useSelector consumers if using react-ecsal
   */
  public notifySubscribers = (): void => {
    this.storeSubscribers.forEach((subscriber) => {
      subscriber(this);
    });
  };

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
  ): ReadonlyComponentManager<C> => {
    return this.getMgrMut(cclass) as ReadonlyComponentManager<C>;
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
  ): ReadonlyComponentManager<C> => {
    return this.tryGetMgrMut(cclass) as ReadonlyComponentManager<C>;
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
    e: Entity,
  ): DeepReadonly<C> => {
    const cMgr = this.tryGetMgr(cclass);
    return cMgr.get(e);
  };

  /** Returns a mutable reference to a component, which must exist. */
  public getCmptMut = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
    entity: Entity,
  ): C => {
    const cMgr = this.tryGetMgrMut<C>(cclass);
    return cMgr.getMut(entity);
  };

  /** Returns a readonly reference to a component, or undefined if it doesn't exist. */
  public tryGetCmpt = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
    entity: Entity,
  ): DeepReadonly<C> | undefined => {
    const cMgr = this.tryGetMgr<C>(cclass);
    return cMgr.tryGet(entity);
  };

  /** Returns a mutable reference to a component, or undefined if it doesn't exist. */
  public tryGetCmptMut = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
    entity: Entity,
  ): C | undefined => {
    const cMgr = this.tryGetMgrMut<C>(cclass);
    return cMgr.tryGetMut(entity);
  };

  /** Gets a unique component, readonly. Convenenience function for special components like lookup tables. */
  public getUniqueCmpt = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
  ): DeepReadonly<C> => {
    const cMgr = this.tryGetMgr<C>(cclass);
    return cMgr.getUnique();
  };

  /** Gets a unique component, mutable. Convenenience function for special components like lookup tables. */
  public getUniqueCmptMut = <C extends NComponent>(cclass: NComponentConstructor<C>): C => {
    const cMgr = this.tryGetMgrMut<C>(cclass);
    return cMgr.getUniqueMut();
  };

  public tryGetUniqueCmpt = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
  ): DeepReadonly<C> | undefined => {
    const cMgr = this.tryGetMgr<C>(cclass);
    return cMgr.tryGetUnique();
  };

  /** Gets a unique component if exists, mutable. */
  public tryGetUniqueCmptMut = <C extends NComponent>(
    cclass: NComponentConstructor<C>,
  ): C | undefined => {
    const cMgr = this.tryGetMgr<C>(cclass);
    return cMgr.tryGetUniqueMut();
  };

  /** Creates a component, adds it to an entity, and returns it. */
  public addCmpt<C extends NComponent>(e: number, cmpt: C): void {
    const cMgr = this.tryGetMgrMut<C>(cmpt.constructor as NComponentConstructor<C>);
    cMgr.add(e, cmpt);
  }

  public getView = <ComponentDependencies extends AbstractComponentClasses>(
    componentDependencies: ComponentDependencies,
    componentManagers?: ComponentManagersFromClasses<ComponentDependencies>,
  ): View<ComponentDependencies> => {
    const view = new View(componentDependencies, this, componentManagers);
    return view;
  };

  public queueEntityDestruction(e: Entity): void {
    this.entitiesToDestroy.push(e);
  }

  private destroyQueuedEntities() {
    this.entitiesToDestroy.forEach((e) => {
      this.destroyEntity(e);
    });
    this.entitiesToDestroy = [];
  }

  private destroyEntity(e: Entity) {
    // Multiple destroy requests for an entity may occur in one frame -- is this an issue?
    // We could at least optimizely when we add tracking for deleted entities.
    Object.values(this.cMgrs).forEach((cMgr) => cMgr.remove(e));
  }

  private incrementNextEntityId(): void {
    ++this.nextEntityId;
  }
}

type GetComponentFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
  entity: Entity,
) => C | undefined;

type GetComponentManagerFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
) => ComponentManager<C>;

/** @deprecated Avoid global accessor functions */
export const GetComponentManager: GetComponentManagerFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
): ComponentManager<C> => EntityManager.instance.tryGetMgrMut<C>(cclass);

/** @deprecated Avoid global accessor functions */
export const GetComponent: GetComponentFuncType = <C extends NComponent>(
  cclass: NComponentConstructor<C>,
  entity: Entity,
): C | undefined => EntityManager.instance.tryGetMgrMut<C>(cclass).tryGetMut(entity);

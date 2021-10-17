import { Entity, EntityManager, NComponent, NComponentConstructor, View } from '0-engine';
import { AbstractComponentClasses } from '0-engine/ECS/component-dependencies/ComponentDependencies';
import { isEqual, VersionedData } from '0-engine/ECS/component-manager/ComponentManager';
import { ComponentDependenciesFromView } from '0-engine/ECS/query/View';
import { DeepReadonly } from 'ts-essentials';

/* *
 * In Recoil/Jotai, there are two types of nodes:
 * - atom: base node
 * - selector: derived node
 *
 * In Ecsal, we have a separate store (ECS) so atoms don't exist in the same sense.
 * All of our state is in a way "derived" since it's querying the actual ECS store.
 * Therefore we have the following nodes:
 * - component: Simple query if you know the component and entity ID
 * - unique component: Simple query for singleton components
 * - view: Advanced query using ECS View
 * - selector: Derived node (same as Recoil)
 */

type NodeKey = number;

/** Global key count */
let nodeKeyCounter = 0;

export type ComponentNode<C extends NComponent> = {
  key: NodeKey;
  cclass: NComponentConstructor<C>;
  entity: Entity;
};

export type UniqueComponentNode<C extends NComponent> = {
  key: NodeKey;
  cclass: NComponentConstructor<C>;
  isUnique: true;
};

/**
 * A node type specific to ECS.
 */
export type ViewNode<V extends View<AbstractComponentClasses>> = {
  key: NodeKey;
  componentDependencies: ComponentDependenciesFromView<V>;
};

export type Getter = <V>(node: Node<V>) => VersionedData<V | undefined>;

type SelectorGet<T> = ({ get }: { get: Getter }) => DeepReadonly<T>;

export type SelectorNode<T> = {
  key: NodeKey;
  get: SelectorGet<T>;
};

type DependencySet = Set<NodeKey>;

export type Node<T> =
  | ComponentNode<T>
  | UniqueComponentNode<T>
  | ViewNode<T extends View<AbstractComponentClasses> ? T : never>
  | SelectorNode<T>;

export type CacheState = {
  dependencyMap: Map<NodeKey, DependencySet>;
  nodes: Map<NodeKey, Node<any>>;
  valueCache: Map<NodeKey, VersionedData<any>>;
  /**
   * Valid during single engine tick, how we keep track of whether we've checked a node
   * for updates this engine tick yet
   */
  wipCache: Map<NodeKey, VersionedData<any>>;
};

export function createCacheState(): CacheState {
  return {
    dependencyMap: new Map(),
    nodes: new Map(),
    valueCache: new Map(),
    wipCache: new Map(),
  };
}

// $FIXME: this should be memoized so if the same component is accessed from different
// React components, it should not duplicate the node
export function componentNode<C extends NComponent>(
  cclass: NComponentConstructor<C>,
  entity: Entity,
): ComponentNode<C> {
  const key = nodeKeyCounter++;
  return { key, cclass, entity };
}

export function uniqueComponentNode<C extends NComponent>(
  cclass: NComponentConstructor<C>,
): UniqueComponentNode<C> {
  const key = nodeKeyCounter++;
  return { key, cclass, isUnique: true };
}

export function selectorNode<T>({ get }: { get: SelectorGet<T> }): SelectorNode<T> {
  const key = nodeKeyCounter++;
  return { key, get };
}

/**
 * Returns selector nodes that are cached based on a key provided by computeKey.
 */
export function selectorNodeFamily<T, Args extends any[]>({
  computeKey,
  get,
}: {
  computeKey: (...args: Args) => string;
  get: (...args: Args) => SelectorGet<T>;
}): (...args: Args) => SelectorNode<T> {
  const selectors: Map<string, SelectorNode<T>> = new Map();
  return function selectorNodeFromFamily(...args: Args) {
    const key = computeKey(...args);
    const existing = selectors.get(key);
    if (existing) {
      return existing;
    }
    const selector = selectorNode({ get: get(...args) });
    selectors.set(key, selector);
    return selector;
  };
}

// TODO: change to take an array of ReadCmpts instead of the full ComponentClasses object
export function viewNode<ComponentDependencies extends AbstractComponentClasses>(
  componentDependencies: ComponentDependencies,
): ViewNode<View<ComponentDependencies>> {
  const key = nodeKeyCounter++;
  return { key, componentDependencies };
}

function isSelectorNode<T>(node: Node<T>): node is SelectorNode<T> {
  return typeof (node as any).get === 'function';
}

function isViewNode<T>(
  node: Node<T>,
): node is ViewNode<T extends View<AbstractComponentClasses> ? T : never> {
  return typeof (node as any).componentDependencies === 'object';
}

function isUniqueComponentNode<T>(node: Node<T>): node is UniqueComponentNode<T> {
  return (node as any).isUnique === true;
}

/** Returns true if at least 1 dep has changed, so the selector must be re-run */
function depsHaveChanged<T>(
  cacheState: CacheState,
  eMgr: EntityManager,
  cached: VersionedData<T>,
  deps?: DependencySet,
): boolean {
  const { nodes, valueCache } = cacheState;
  if (!deps) {
    throw new Error(
      'Selector node was run in previous tick but has no dependency map. Either your selector has no dependencies or a bug has occurred.',
    );
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const dep of deps) {
    const depNode = nodes.get(dep);
    if (!depNode) {
      throw new Error('Cached selector dependency does not have node in cache.');
    }
    const cachedDep = valueCache.get(depNode.key);
    const wipDepState = read(cacheState, eMgr, depNode);
    if (typeof cachedDep === 'undefined' || !isEqual(cachedDep, wipDepState)) return true;
  }
  return false;
}

/**
 * Read game state, taking advantage of mutating tracking in the engine
 * to build a cache. You should clear the cache before starting a read
 * on a new engine tick.
 */
export function read<Data>(
  cacheState: CacheState,
  eMgr: EntityManager,
  node: Node<Data>,
): VersionedData<Data | undefined> {
  const { dependencyMap, nodes, valueCache, wipCache } = cacheState;
  const { key } = node;
  let cached: VersionedData<Data> | undefined;
  if (wipCache.has(key)) {
    // We've already run this node during this tick, so we can just return it
    cached = wipCache.get(key) as VersionedData<Data>;
    return cached;
  }

  // This is the cached value (if it exists) from previous ticks, but we need to check if it's valid or stale
  cached = valueCache.get(key) as VersionedData<Data>;

  if (isSelectorNode(node)) {
    if (cached) {
      // We've run this selector in a previous tick, only rerun if a dependency has changed
      const deps = dependencyMap.get(key);
      const selectorNeedsToBeReRun = depsHaveChanged(cacheState, eMgr, cached, deps);
      if (!selectorNeedsToBeReRun) {
        // Selector does not need to be re-run since all dependencies are unchanged
        wipCache.set(key, cached);
        return cached;
      }

      // Selector needs to be re-run, so we'll fall through to the base behavior
    }

    // Run the selector and build the dependency array
    const { get: getter } = node;
    const dependencies: DependencySet = new Set();
    const value = getter({
      get: <V>(n: Node<V>) => {
        // Register dependencies
        dependencies.add(n.key);
        return read(cacheState, eMgr, n);
      },
    });
    dependencyMap.set(key, dependencies);
    nodes.set(key, node);

    // Because the underlying state can be mutated, selectors need to be versioned just like components
    const oldVersion = cached?.[1] ?? 0;
    const returnVal: VersionedData<Data | undefined> = [value, oldVersion + 1];
    wipCache.set(key, returnVal);
    return returnVal;
  }

  if (isViewNode(node)) {
    if (cached) {
      // Currently we have no way to tell if a view needs to be rerun.
      // Improving this falls to the engine's responsibility -- it will need
      // a mechanism to detect mutations, similar to how component managers have
      // a mechanism to detect mutations between ticks.
      //
      // Unfortunately, this means views are recomputed every tick, so we'll be relying
      // on downstream memoization via SelectorNodes for any performance savings.
    }

    // Run the view query
    const { componentDependencies } = node;
    const view = eMgr.getView(componentDependencies);
    const readonlyView = view as unknown as DeepReadonly<Data>;
    nodes.set(key, node);

    // This should be unnecessary since eMgr.getView returns a new object on each call.
    // However, just in case, we'll increment the version number.
    const oldVersion = cached?.[1] ?? 0;
    const returnVal: VersionedData<Data> = [readonlyView, oldVersion + 1];
    wipCache.set(key, returnVal);
    return returnVal;
  }

  let data: VersionedData<Data | undefined>;
  if (isUniqueComponentNode(node)) {
    // Unique component node
    const { cclass } = node;
    data = eMgr.getUniqueWithVersion(cclass);
  } else {
    // Component node
    const { cclass, entity } = node;
    data = eMgr.getWithVersion(cclass, entity);
  }

  if (cached && data) {
    if (isEqual(cached, data)) {
      wipCache.set(key, cached);
      return cached;
    }
  }
  wipCache.set(key, data);
  nodes.set(key, node);
  return data;
}

// Call when the engine completes a frame to indicate data may need to update
export function commit(cacheState: CacheState): void {
  const { valueCache, wipCache } = cacheState;
  // Merge wip into main cache
  wipCache.forEach((value, key) => {
    valueCache.set(key, value);
  });
  wipCache.clear();
}

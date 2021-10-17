import { DeepReadonly } from 'ts-essentials';
import { Entity } from '../Entity';
import { NComponent, NComponentConstructor } from '../NComponent';

export type Version = number;

export type VersionedData<Data> = [DeepReadonly<Data>, Version];

/**
 * Returns true if two components are the same version.
 * Used for detecting mutations.
 */
export function isEqual(old: VersionedData<any>, cur: VersionedData<any>): boolean {
  return old[0] === cur[0] && old[1] === cur[1];
}

export class ComponentManager<C extends NComponent> {
  constructor(c: NComponentConstructor<C>) {
    this.components = new Map();
    this.versions = new Map();
    this.MyClass = c;
  }

  /** Constructs a new component and attaches it to the given entity.
   * @returns A mutable reference to the new component.
   */
  public add(e: Entity, cmpt: C): void {
    this.components.set(e, cmpt);
    this.versions.set(e, 0);
  }

  /** Returns the number of components. */
  public get length(): number {
    return this.components.size;
  }

  /** Returns an immutable reference to a component, which must exist. */
  public get(e: Entity): DeepReadonly<C> {
    const c = this.components.get(e);
    if (c == null) {
      throw new Error(`Unexpected missing component ${this.MyClass.name} for entity ${e}`);
    }

    return c as DeepReadonly<C>;
  }

  /**
   * Returns a mutable reference to a component, which must exist.
   * Mutable references may have performance implications, so use the immutable version whenever possible.
   */
  public getMut(e: Entity): C {
    const c = this.tryGetMut(e);
    if (c == null) {
      throw new Error(`Unexpected missing component ${this.MyClass.name} for entity ${e}`);
    }

    return c;
  }

  /**
   * Returns an immutable reference to a component, or undefined if it doesn't exist.
   */
  public tryGet(e: Entity): DeepReadonly<C> | undefined {
    return this.components.get(e) as DeepReadonly<C> | undefined;
  }

  /**
   * Returns a mutable reference to a component, or undefined if it doesn't exist.
   * Mutable references may have performance implications, so use the immutable version whenever possible.
   * */
  public tryGetMut(e: Entity): C | undefined {
    const c = this.components.get(e);
    const version = this.versions.get(e);
    if (version != null) {
      this.versions.set(e, version + 1);
    }
    return c;
  }

  /**
   * Used when there's only one component in the manager (singleton pattern).
   */
  public getUnique(): DeepReadonly<C> {
    return this.getAsArray()[0];
  }

  /**
   * Used when there's only one component in the manager (singleton pattern).
   */
  public getUniqueMut(): C {
    const e = this.entities()[0];
    return this.getMut(e);
  }

  /**
   * See getUnique
   */
  public tryGetUnique(): DeepReadonly<C> | undefined {
    return this.getAsArray()[0];
  }

  /**
   * See getUniqueMut
   */
  public tryGetUniqueMut(): C | undefined {
    const e = this.entities()[0];
    return this.tryGetMut(e);
  }

  /**
   * For consumers who want to detect mutations, returns a version that can be compared.
   */
  public getWithVersion(e: Entity): [DeepReadonly<C> | undefined, Version] {
    const c = this.tryGet(e);
    return [c, this.versions.get(e) ?? -1];
  }

  public getUniqueWithVersion(): [DeepReadonly<C> | undefined, Version] {
    const c = this.tryGetUnique();
    return [c, [...this.versions.values()][0] ?? -1];
  }

  /** Destroys a component. */
  public remove(e: Entity): void {
    this.components.delete(e);
    this.versions.delete(e);
  }

  /** Returns `true` if a component exists for this entity. */
  public has(e: Entity): boolean {
    return this.components.has(e);
  }

  public entries(): [Entity, C][] {
    return [...this.components.entries()];
  }

  public entities(): Entity[] {
    return [...this.components.keys()];
  }

  /** Returns all components as an array */
  public getAsArray(): DeepReadonly<C>[] {
    return [...this.components.values()] as DeepReadonly<C>[];
  }

  /** Iterate over mutable */
  public forEach(func: (component: C) => void): void {
    this.components.forEach(func);
  }

  /** For debugging only! */
  public getAsDict(): { [key: string]: C } {
    return Object.fromEntries(this.components);
  }

  public MyClass: NComponentConstructor<C>;

  /**
   * The current internal component container. May change in the future.
   * Exposed for debugging reasons.
   * */
  protected components: Map<Entity, C>;

  /**
   * Internal version tracker. May change in the future.
   * Exposed for debugging reasons.
   */
  protected versions: Map<Entity, Version>;

  // Queries that we would like to generalize and optimize some day
  public findByProperty<K extends keyof C>(key: K, value: C[K]): C[] {
    const matchingComponents: C[] = [];
    this.components.forEach((c) => {
      if (c[key] === value) {
        matchingComponents.push(c);
      }
    });
    return matchingComponents;
  }
}

const mutationErrorMessage = 'Tried to use a mutating method on a readonly ComponentManager!';
export class ReadonlyComponentManager<C extends NComponent> extends ComponentManager<C> {
  public add(): never {
    throw new Error(mutationErrorMessage);
  }

  public getMut(): never {
    throw new Error(mutationErrorMessage);
  }

  public tryGetMut(): never {
    throw new Error(mutationErrorMessage);
  }

  public remove(): never {
    throw new Error(mutationErrorMessage);
  }

  constructor(cMgr: ComponentManager<C>) {
    super(cMgr.MyClass);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore For some reason the next line shows a typescript issue
    this.components = cMgr.components;
  }
}

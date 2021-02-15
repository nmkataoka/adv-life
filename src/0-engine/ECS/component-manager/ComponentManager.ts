import { DeepReadonly } from 'ts-essentials';
import { Entity } from '../Entity';
import { NComponent, NComponentConstructor } from '../NComponent';

/**
 * Currently 'immutability' works as follows:
 * -
 */
export class ComponentManager<C extends NComponent> {
  constructor(c: NComponentConstructor<C>) {
    this.components = new Map();
    this.MyClass = c;
  }

  /** Constructs a new component and attaches it to the given entity.
   * @returns A mutable reference to the new component.
   */
  public add(e: Entity, cmpt: C): void {
    this.components.set(e, cmpt);
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

  /** Destroys a component. */
  public remove(e: Entity): void {
    this.components.delete(e);
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

  /** Returns all components mutably as an array */
  public getAsArrayMut(): C[] {
    return [...this.components.values()];
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

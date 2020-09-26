import { NComponent, NComponentConstructor } from './NComponent';

export class ComponentManager<C extends NComponent> {
  constructor(c: NComponentConstructor<C>) {
    this.components = {};
    this.MyClass = c;
  }

  /** Constructs a new component and attaches it to the given entity.
   * @returns A mutable reference to the new component.
   */
  public add(e: number, cmpt: C): void {
    this.components[e] = cmpt;
  }

  /** Returns the number of components. */
  public get length(): number {
    return Object.values(this.components).length;
  }

  /** Returns an immutable reference to a component, which must exist. */
  public get(e: number | string): Readonly<C> {
    const c = this.components[e];
    if (c == null) {
      throw new Error(`Unexpected missing component ${this.MyClass.name} for entity ${e}`);
    }
    return c;
  }

  /**
   * Returns a mutable reference to a component, which must exist.
   * Mutable references may have performance implications, so use the immutable version whenever possible.
   */
  public getMut(e: number | string): C {
    return this.get(e);
  }

  /**
   * Returns an immutable reference to a component, or undefined if it doesn't exist.
   */
  public tryGet(e: number | string): Readonly<C> | undefined {
    return this.components[e];
  }

  /**
   * Returns a mutable reference to a component, or undefined if it doesn't exist.
   * Mutable references may have performance implications, so use the immutable version whenever possible.
   * */
  public tryGetMut(e: number | string): C | undefined {
    return this.tryGet(e);
  }

  /** Destroys a component. */
  public remove(e: number | string): void {
    delete this.components[e];
  }

  /** Returns `true` if a component exists for this entity. */
  public has(e: number | string): boolean {
    return !!this.components[e];
  }

  public MyClass: NComponentConstructor<C>;

  /**
   * The current internal component container. May change in the future.
   * Exposed for debugging reasons.
   * */
  public components: { [key: string]: C };
}

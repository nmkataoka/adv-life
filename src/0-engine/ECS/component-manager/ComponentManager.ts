import { DeepReadonly } from 'ts-essentials';
import { NComponent, NComponentConstructor } from '../NComponent';

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
  public get(e: number | string): DeepReadonly<C> {
    return this.getMut(e) as DeepReadonly<C>;
  }

  /**
   * Returns a mutable reference to a component, which must exist.
   * Mutable references may have performance implications, so use the immutable version whenever possible.
   */
  public getMut(e: number | string): C {
    const c = this.components[e];
    if (c == null) {
      throw new Error(`Unexpected missing component ${this.MyClass.name} for entity ${e}`);
    }
    return c;
  }

  /**
   * Returns an immutable reference to a component, or undefined if it doesn't exist.
   */
  public tryGet(e: number | string): DeepReadonly<C> | undefined {
    return this.tryGetMut(e) as DeepReadonly<C> | undefined;
  }

  /**
   * Returns a mutable reference to a component, or undefined if it doesn't exist.
   * Mutable references may have performance implications, so use the immutable version whenever possible.
   * */
  public tryGetMut(e: number | string): C | undefined {
    return this.components[e];
  }

  /** Destroys a component. */
  public remove(e: number | string): void {
    delete this.components[e];
  }

  /** Returns `true` if a component exists for this entity. */
  public has(e: number | string): boolean {
    return !!this.components[e];
  }

  public entries(): [string, C][] {
    return Object.entries(this.components);
  }

  public entities(): string[] {
    return Object.keys(this.components);
  }

  /** Returns all components as an array */
  public getAsArray(): DeepReadonly<C>[] {
    return Object.values(this.components) as DeepReadonly<C>[];
  }

  /** Returns all components mutably as an array */
  public getAsArrayMut(): C[] {
    return Object.values(this.components);
  }

  /** For debugging only! */
  public getAsDict(): { [key: string]: C } {
    return this.components;
  }

  public MyClass: NComponentConstructor<C>;

  /**
   * The current internal component container. May change in the future.
   * Exposed for debugging reasons.
   * */
  protected components: { [key: string]: C };
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

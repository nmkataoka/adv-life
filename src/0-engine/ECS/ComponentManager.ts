import { Entity } from './Entity';
import { NComponent, NComponentConstructor } from './NComponent';

export class ComponentManager<C extends NComponent, CClass extends NComponentConstructor<C>> {
  constructor(c: CClass) {
    this.components = {};
    this.myClass = c;
  }

  public Add(e: Entity, c: C): void {
    this.components[e.handle] = c;
  }

  public get Count(): number {
    return Object.values(this.components).length;
  }

  public Get(e: Entity): C | undefined {
    return this.components[e.handle];
  }

  public GetByNumberUncertain(handle: number | string): C | undefined {
    return this.components[handle];
  }

  // Use this accessor when you are certain the component exists
  public GetByNumber(handle: number | string): C {
    const c = this.components[handle];
    if (c == null) {
      throw new Error(`Unexpected missing component ${this.myClass.name} for entity ${handle}`);
    }

    return c;
  }

  public Erase(e: Entity | number): void {
    let handle: number;
    if (typeof e === 'number') {
      handle = e;
    } else {
      ({ handle } = e);
    }
    delete this.components[handle];
  }

  public Has(e: Entity | number | string): boolean {
    let handle: number | string;
    if (typeof e === 'number' || typeof e === 'string') {
      handle = e;
    } else {
      ({ handle } = e);
    }
    return !!this.components[handle];
  }

  public myClass: CClass;

  public components: { [key: string]: C };
}

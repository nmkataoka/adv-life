import { NComponent, NComponentConstructor } from './NComponent';

export class ComponentManager<C extends NComponent> {
  constructor(c: NComponentConstructor<C>) {
    this.components = {};
    this.myClass = c;
  }

  public Add(e: number, c: C): void {
    this.components[e] = c;
  }

  public get Count(): number {
    return Object.values(this.components).length;
  }

  public Get(e: number): C | undefined {
    return this.components[e];
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

  public Erase(e: number): void {
    delete this.components[e];
  }

  public Has(e: number | string): boolean {
    return !!this.components[e];
  }

  public myClass: NComponentConstructor<C>;

  public components: { [key: string]: C };
}

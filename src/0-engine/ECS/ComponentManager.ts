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

  public GetByNumber(handle: number | string): C | undefined {
    return this.components[handle];
  }

  public Erase(e: Entity | number) {
    let handle: number;
    if (typeof e === 'number') {
      handle = e;
    } else {
      ({ handle } = e);
    }
    delete this.components[handle];
  }

  public Has(e: Entity | number | string) {
    let handle: number | string;
    if (typeof e === 'number' || typeof e === 'string') {
      handle = e;
    } else {
      ({ handle } = e);
    }
    return !!this.components[handle];
  }

  private myClass: CClass;

  public components: { [key: string]: C };
}

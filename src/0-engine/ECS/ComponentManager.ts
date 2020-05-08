import { Entity } from "./Entity";
import { NComponent, NComponentConstructor } from "./NComponent";

export class ComponentManager<C extends NComponent, CClass extends NComponentConstructor<C>> {
  constructor(c: CClass) {
    this.components = {};
    this.myClass = c;
  }

  public Add(e: Entity, c: C): void {
    this.components[e.handle] = c;
  }

  public Get(e: Entity): C | undefined {
    return this.components[e.handle];
  }

  public GetByNumber(handle: number): C | undefined {
    return this.components[handle];
  }

  public Erase(e: Entity | number) {
    let handle: number;
    if (typeof e === "number") {
      handle = e;
    } else {
      ({ handle } = e);
    }
    delete this.components[handle];
  }

  private myClass: CClass;
  public components: { [key: number]: C };
}

import { Entity } from "./Entity";
import { NComponent, NComponentConstructor } from "./NComponent";

export class ComponentManager<C extends NComponent, CClass extends NComponentConstructor<C>> {
  constructor(c: CClass) {
    this.components = {};
    this.myClass = c;
  }

  public Add(e: Entity): void {
    this.components[e.handle] = new this.myClass();
  }

  public static InitializeStatic() {
    ComponentManager.ClassFamilies = {};
  }

  private static ClassFamilies: {[key: string]: number};

  private myClass: CClass;
  private components: {[key: number]: C};
}
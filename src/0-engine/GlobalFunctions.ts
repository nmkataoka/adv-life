import { NComponentConstructor, NComponentConstructorCFromCClass } from "./ECS/NComponent";
import { ComponentManager } from "./ECS/ComponentManager";
import { GameManager } from "./GameManager";
import { ECSystemConstructor, ECSystemConstructorCFromCClass, ECSystem } from "./ECS/ECSystem";

// Shortcut global functions
export function GetComponentManager<
  CClass extends NComponentConstructor<C>,
  C = NComponentConstructorCFromCClass<CClass>
>(cclass: CClass): ComponentManager<C, CClass> {
  return GameManager.instance.eMgr.GetComponentManager<CClass, C>(cclass);
}

export function GetComponent<
  CClass extends NComponentConstructor<C>,
  C = NComponentConstructorCFromCClass<CClass>
>(cclass: CClass, entity: number): C | undefined {
  return GameManager.instance.eMgr.GetComponentManager<CClass, C>(cclass).GetByNumber(entity);
}

export function GetSystem<
  CClass extends ECSystemConstructor<C>,
  C extends ECSystem = ECSystemConstructorCFromCClass<CClass>
>(cclass: CClass): C {
  return GameManager.instance.eMgr.GetSystem(cclass);
}

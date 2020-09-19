import { NComponentConstructor } from './NComponent';
import { ComponentManager } from './ComponentManager';
import { EntityManager } from './EntityManager';

type NComponentConstructorArray = NComponentConstructor<any>[];

type CMgrs<T extends NComponentConstructorArray> = {
  [K in keyof T]: T[K] extends NComponentConstructor<infer C> ? ComponentManager<C, T[K]> : never;
};

type CsFromConstructors<T extends NComponentConstructorArray> = {
  [K in keyof T]: T[K] extends NComponentConstructor<infer C> ? C : never;
};

export function GetView<T extends NComponentConstructorArray>(
  eMgr: EntityManager,
  without: number,
  ...cons: T
): View<T> {
  return new View(eMgr, without, ...cons);
}

export class View<T extends NComponentConstructorArray> {
  constructor(eMgr: EntityManager, without: number, ...cons: T) {
    this.cMgrs = cons.map((CClass) => eMgr.GetComponentManager(CClass)) as CMgrs<T>;

    this.entities = FindEntitiesWithComponents(this.cMgrs, without);
  }

  public cMgrs: CMgrs<T>;

  public entities: string[];

  public At(idx: number): string {
    return this.entities[idx];
  }

  public get Count(): number {
    return this.entities.length;
  }

  public ForEach(func: (e: string, components: CsFromConstructors<T>) => void): void {
    for (let i = 0; i < this.Count; ++i) {
      const e = this.At(i);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const components = this.cMgrs.map((cMgr) => cMgr.GetByNumber(e)) as CsFromConstructors<T>;
      func(e, components);
    }
  }
}

function FindEntitiesWithComponents(cMgrs: ComponentManager<any, any>[], without: number): string[] {
  const requiredCMgrs = cMgrs.slice(0, cMgrs.length - without);
  const withoutCMgrs = cMgrs.slice(cMgrs.length - without);

  // Start with the list of entities associated with the least common component.
  // I.e. cMgr with the fewest number of active components.
  // Then iterate in ascending order of cMgr size.
  // This minimizes the number of cMgr.Has checks.
  if (requiredCMgrs.length > 0) {
    requiredCMgrs.sort((ssa, ssb) => ssa.Count - ssb.Count);
  } else {
    throw new Error('Entity view must contain at least one required component.');
  }

  const startingEntityList = Object.keys(requiredCMgrs[0].components);
  const viewEntities: string[] = [];
  for (let i = 0; i < startingEntityList.length; ++i) {
    const e = startingEntityList[i];

    if (!requiredCMgrs[0].Has(e)) {
      throw new Error('Internal error in view creation');
    }

    let hasAllComponents = true;

    // Check if entity has all components
    for (let j = 1; j < requiredCMgrs.length; ++j) {
      if (!requiredCMgrs[j].Has(e)) hasAllComponents = false;
      break;
    }

    if (hasAllComponents) {
      // Check if entity is properly MISSING components
      for (let j = 0; j < withoutCMgrs.length; ++j) {
        if (withoutCMgrs[j].Has(e)) hasAllComponents = false;
        break;
      }

      if (hasAllComponents) {
        viewEntities.push(e);
      }
    }
  }

  return viewEntities;
}

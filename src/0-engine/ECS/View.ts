import { NComponent, NComponentConstructor } from './NComponent';
import { ComponentManager } from './ComponentManager';
import { EntityManager } from './EntityManager';

type CMgrs<T extends unknown[]> = {
  [K in keyof T]: T[K] extends NComponent ? ComponentManager<T[K]> : never;
};

export type ConstructorsFromComponents<T extends unknown[]> = {
  [K in keyof T]: T[K] extends NComponent ? NComponentConstructor<T[K]> : never;
};

export class View<
  ReadCmpts extends NComponent[],
  WriteCmpts extends NComponent[],
  WithoutCmpts extends NComponent[]
> {
  constructor(
    eMgr: EntityManager,
    readCmpts: ConstructorsFromComponents<ReadCmpts>,
    writeCmpts: ConstructorsFromComponents<WriteCmpts>,
    withoutCmpts: ConstructorsFromComponents<WithoutCmpts>,
  ) {
    this.readCMgrs = readCmpts.map((CClass) => eMgr.tryGetMgr(CClass)) as CMgrs<ReadCmpts>;
    this.writeCMgrs = writeCmpts.map((CClass) => eMgr.tryGetMgrMut(CClass)) as CMgrs<WriteCmpts>;
    this.withoutCMgrs = withoutCmpts.map((CClass) => eMgr.tryGetMgr(CClass)) as CMgrs<WithoutCmpts>;

    this.entities = FindEntitiesWithComponents(
      [...this.readCMgrs, ...this.writeCMgrs, ...this.withoutCMgrs],
      withoutCmpts.length,
    );
  }

  private readCMgrs: CMgrs<ReadCmpts>;

  private writeCMgrs: CMgrs<WriteCmpts>;

  private withoutCMgrs: CMgrs<WithoutCmpts>;

  public entities: number[];

  public at(idx: number): number {
    return this.entities[idx];
  }

  public get count(): number {
    return this.entities.length;
  }

  public forEach(func: (e: number, readCmpts: ReadCmpts, writeCmpts: WriteCmpts) => void): void {
    for (let i = 0; i < this.count; ++i) {
      const e = this.at(i);
      const readCmpts = this.readCMgrs.map((cMgr) => cMgr.get(e)) as ReadCmpts;
      const writeCmpts = this.writeCMgrs.map((cMgr) => cMgr.getMut(e)) as WriteCmpts;
      func(e, readCmpts, writeCmpts);
    }
  }
}

function FindEntitiesWithComponents(cMgrs: ComponentManager<any>[], without: number): number[] {
  const requiredCMgrs = cMgrs.slice(0, cMgrs.length - without);
  const withoutCMgrs = cMgrs.slice(cMgrs.length - without);

  // Start with the list of entities associated with the least common component.
  // I.e. cMgr with the fewest number of active components.
  // Then iterate in ascending order of cMgr size.
  // This minimizes the number of cMgr.Has checks.
  if (requiredCMgrs.length > 0) {
    requiredCMgrs.sort((ssa, ssb) => ssa.length - ssb.length);
  } else {
    throw new Error('Entity view must contain at least one required component.');
  }

  const startingEntityList = Object.keys(requiredCMgrs[0].components);
  const viewEntities: number[] = [];
  for (let i = 0; i < startingEntityList.length; ++i) {
    const e = startingEntityList[i];

    if (!requiredCMgrs[0].has(e)) {
      throw new Error('Internal error in view creation');
    }

    let hasAllComponents = true;

    // Check if entity has all components
    for (let j = 1; j < requiredCMgrs.length; ++j) {
      if (!requiredCMgrs[j].has(e)) hasAllComponents = false;
      break;
    }

    if (hasAllComponents) {
      // Check if entity is properly MISSING components
      for (let j = 0; j < withoutCMgrs.length; ++j) {
        if (withoutCMgrs[j].has(e)) hasAllComponents = false;
        break;
      }

      if (hasAllComponents) {
        viewEntities.push(parseInt(e, 10));
      }
    }
  }

  return viewEntities;
}

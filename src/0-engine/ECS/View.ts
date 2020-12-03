import { DeepReadonly } from 'ts-essentials';
import { NComponent } from './NComponent';
import { ComponentManager } from './ComponentManager';
import { EntityManager } from './EntityManager';
import { ComponentClasses, ComponentManagers, Components } from './ComponentDependencies';

export class View<
  ReadCmpts extends NComponent[],
  WriteCmpts extends NComponent[],
  WithoutCmpts extends NComponent[] = []
> {
  constructor(
    componentDependencies: ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>,
    eMgr?: EntityManager,
    cMgrs?: ComponentManagers<ReadCmpts, WriteCmpts, WithoutCmpts>,
  ) {
    if (!cMgrs) {
      if (!eMgr) {
        throw new Error('View creation requires either `eMgr` or `cMgrs` must be supplied.');
      }
      cMgrs = componentDependencies.getComponentManagers(eMgr);
    }
    this.cMgrs = cMgrs;

    this.entities = FindEntitiesWithComponents(cMgrs.toArray(), cMgrs.withoutCMgrs?.length ?? 0);
  }

  private cMgrs: ComponentManagers<ReadCmpts, WriteCmpts, WithoutCmpts>;

  public entities: number[];

  public at(idx: number): number {
    return this.entities[idx];
  }

  public get count(): number {
    return this.entities.length;
  }

  public forEach(func: (e: number, components: Components<ReadCmpts, WriteCmpts>) => void): void {
    for (let i = 0; i < this.count; ++i) {
      const e = this.at(i);
      const components = {
        readCmpts: this.cMgrs.readCMgrs?.map((cMgr) => cMgr.get(e)) as DeepReadonly<ReadCmpts>,
        writeCmpts: this.cMgrs.writeCMgrs?.map((cMgr) => cMgr.getMut(e)) as WriteCmpts,
      };
      func(e, components);
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

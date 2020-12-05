import { ComponentManager } from './ComponentManager';
import { EntityManager } from './EntityManager';
import {
  AbstractComponentClasses,
  ComponentManagersFromClasses,
  PresentComponents,
} from './ComponentDependencies';

export class View<ComponentDependencies extends AbstractComponentClasses> {
  constructor(
    componentDependencies: ComponentDependencies,
    eMgr?: EntityManager,
    cMgrs?: ComponentManagersFromClasses<ComponentDependencies>,
  ) {
    if (!cMgrs) {
      if (!eMgr) {
        throw new Error('View creation requires either `eMgr` or `cMgrs` must be supplied.');
      }
      this.cMgrs = componentDependencies.getComponentManagers(
        eMgr,
      ) as ComponentManagersFromClasses<ComponentDependencies>;
    } else {
      this.cMgrs = cMgrs;
    }

    this.entities = FindEntitiesWithComponents(
      this.cMgrs.toArray(),
      this.cMgrs.withoutCMgrs?.length ?? 0,
    );
  }

  private cMgrs: ComponentManagersFromClasses<ComponentDependencies>;

  public entities: number[];

  public at(idx: number): number {
    return this.entities[idx];
  }

  public get count(): number {
    return this.entities.length;
  }

  public forEach(
    func: (e: number, components: PresentComponents<ComponentDependencies>) => void,
  ): void {
    for (let i = 0; i < this.count; ++i) {
      const e = this.at(i);
      const components = {
        readCmpts: this.cMgrs.readCMgrs?.map((cMgr) => cMgr.get(e)),
        writeCmpts: this.cMgrs.writeCMgrs?.map((cMgr) => cMgr.getMut(e)),
      } as PresentComponents<ComponentDependencies>;
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

  const startingEntityList = requiredCMgrs[0].entities();
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

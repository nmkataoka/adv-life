import { ComponentManager } from './ComponentManager';
import { EntityManager } from './EntityManager';
import { NComponent, NComponentConstructor } from './NComponent';

export type AbstractComponentClasses = ComponentClasses<NComponent[], NComponent[], NComponent[]>;

type ConstructorsFromComponents<T extends unknown[]> = {
  [K in keyof T]: T[K] extends NComponent ? NComponentConstructor<T[K]> : never;
};

class ComponentManagers<
  ReadCmpts extends NComponent[] = [],
  WriteCmpts extends NComponent[] = [],
  WithoutCmpts extends NComponent[] = []
> {
  readCMgrs?: ComponentManager<ReadCmpts[number]>[];

  writeCMgrs?: ComponentManager<WriteCmpts[number]>[];

  withoutCMgrs?: ComponentManager<WithoutCmpts[number]>[];

  constructor(
    data?: Partial<ComponentManagers<[...ReadCmpts], [...WriteCmpts], [...WithoutCmpts]>>,
  ) {
    Object.assign(this, data);
  }

  public toArray = (): ComponentManager<any>[] => [
    ...(this.readCMgrs ?? []),
    ...(this.writeCMgrs ?? []),
    ...(this.withoutCMgrs ?? []),
  ];
}

/**
 * Stores the component classes which a function is dependent on,
 * categorized by the type of access required.
 */
export class ComponentClasses<
  ReadCmpts extends NComponent[] = [],
  WriteCmpts extends NComponent[] = [],
  WithoutCmpts extends NComponent[] = []
> {
  public readCmpts?: ConstructorsFromComponents<[...ReadCmpts]>;

  public writeCmpts?: ConstructorsFromComponents<[...WriteCmpts]>;

  public withoutCmpts?: ConstructorsFromComponents<[...WithoutCmpts]>;

  constructor({
    readCmpts,
    writeCmpts,
    withoutCmpts,
  }: {
    readCmpts?: ConstructorsFromComponents<[...ReadCmpts]>;
    writeCmpts?: ConstructorsFromComponents<[...WriteCmpts]>;
    withoutCmpts?: ConstructorsFromComponents<[...WithoutCmpts]>;
  } = {}) {
    this.readCmpts = readCmpts;
    this.writeCmpts = writeCmpts;
    this.withoutCmpts = withoutCmpts;
  }

  public getComponentManagers = (
    eMgr: EntityManager,
  ): ComponentManagers<ReadCmpts, WriteCmpts, WithoutCmpts> => {
    const readCMgrs = this.readCmpts?.map((CClass) => eMgr.tryGetMgr(CClass));
    const writeCMgrs = this.writeCmpts?.map((CClass) => eMgr.tryGetMgrMut(CClass));
    const withoutCMgrs = this.withoutCmpts?.map((CClass) => eMgr.tryGetMgr(CClass));
    return new ComponentManagers({ readCMgrs, writeCMgrs, withoutCMgrs });
  };
}

/**
 * Views only need a subset of the component types in ComponentDependencies.
 */
export type PresentComponents<
  ComponentDependencies extends AbstractComponentClasses
> = ComponentDependencies extends ComponentClasses<
  infer ReadCmpts,
  infer WriteCmpts,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  infer WithoutCmpts
>
  ? { readCmpts: ReadCmpts; writeCmpts: WriteCmpts }
  : never;

/** Get ComponentManagers type from ComponentClasses */
export type ComponentManagersFromClasses<T> = T extends ComponentClasses<
  infer ReadCmpts,
  infer WriteCmpts,
  infer WithoutCmpts
>
  ? ComponentManagers<ReadCmpts, WriteCmpts, WithoutCmpts>
  : never;

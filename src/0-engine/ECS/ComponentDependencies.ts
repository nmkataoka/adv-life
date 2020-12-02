import { ComponentManager } from './ComponentManager';
import { EntityManager } from './EntityManager';
import { NComponent, NComponentConstructor } from './NComponent';

type CMgrs<T extends unknown[]> = {
  [K in keyof T]: T[K] extends NComponent ? ComponentManager<T[K]> : never;
};

export type ConstructorsFromComponents<T extends unknown[]> = {
  [K in keyof T]: T[K] extends NComponent ? NComponentConstructor<T[K]> : never;
};

export class ComponentManagers<
  ReadCmpts extends NComponent[],
  WriteCmpts extends NComponent[],
  WithoutCmpts extends NComponent[] = []
> {
  readCMgrs?: CMgrs<ReadCmpts>;

  writeCMgrs?: CMgrs<WriteCmpts>;

  withoutCMgrs?: CMgrs<WithoutCmpts>;

  constructor(data?: Partial<ComponentManagers<ReadCmpts, WriteCmpts, WithoutCmpts>>) {
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
  ReadCmpts extends NComponent[],
  WriteCmpts extends NComponent[],
  WithoutCmpts extends NComponent[] = []
> {
  public readCmpts?: ConstructorsFromComponents<ReadCmpts>;

  public writeCmpts?: ConstructorsFromComponents<WriteCmpts>;

  public withoutCmpts?: ConstructorsFromComponents<WithoutCmpts>;

  constructor(data?: Partial<ComponentClasses<ReadCmpts, WriteCmpts, WithoutCmpts>>) {
    Object.assign(this, data);
  }

  public getComponentManagers = (
    eMgr: EntityManager,
  ): ComponentManagers<ReadCmpts, WriteCmpts, WithoutCmpts> => {
    const readCMgrs = this.readCmpts?.map((CClass) => eMgr.tryGetMgr(CClass)) as CMgrs<ReadCmpts>;
    const writeCMgrs = this.writeCmpts?.map((CClass) =>
      eMgr.tryGetMgrMut(CClass),
    ) as CMgrs<WriteCmpts>;
    const withoutCMgrs = this.withoutCmpts?.map((CClass) =>
      eMgr.tryGetMgr(CClass),
    ) as CMgrs<WithoutCmpts>;
    return new ComponentManagers({ readCMgrs, writeCMgrs, withoutCMgrs });
  };
}

/**
 * Views only need a subset of the component types in ComponentDependencies.
 */
export type Components<
  ReadCmpts extends NComponent,
  WriteCmpts extends NComponent,
  WithoutCmpts extends NComponent[] = []
> = {
  readCmpts?: ReadCmpts;
  writeCmpts?: WriteCmpts;
  withoutCmpts?: WithoutCmpts;
};

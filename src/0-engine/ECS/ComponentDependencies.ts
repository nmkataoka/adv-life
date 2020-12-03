import { DeepReadonly } from 'ts-essentials';
import { ComponentManager } from './ComponentManager';
import { EntityManager } from './EntityManager';
import { NComponent, NComponentConstructor } from './NComponent';

export type ConstructorsFromComponents<T extends unknown[]> = {
  [K in keyof T]: T[K] extends NComponent ? NComponentConstructor<T[K]> : never;
};

export class ComponentManagers<
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
export type Components<
  ReadCmpts extends NComponent = [],
  WriteCmpts extends NComponent = [],
  WithoutCmpts extends NComponent[] = []
> = {
  readCmpts?: DeepReadonly<ReadCmpts>;
  writeCmpts?: WriteCmpts;
  withoutCmpts?: WithoutCmpts;
};

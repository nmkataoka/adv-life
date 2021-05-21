import { ComponentManager, ReadonlyComponentManager } from '../component-manager/ComponentManager';
import { EntityManager } from '../EntityManager';
import { NComponent, NComponentConstructor } from '../NComponent';

export type AbstractComponentClasses = ComponentClasses<NComponent[], NComponent[], NComponent[]>;

// For some reason, this syntax works for tuples and arrays,
// whereas the base syntax
//    ComponentManager<ReadCmpts[number]>[]
// always outputs an array. So the tuple type [Cmpt1, Cmpt2] becomes (Cmpt1 | Cmpt2)[]
// which we don't want.
type ConstructorsFromComponents<T extends unknown[]> = {
  [K in keyof T]: T[K] extends NComponent ? NComponentConstructor<T[K]> : never;
};

type ManagersFromClasses<T extends unknown[]> = {
  [K in keyof T]: T[K] extends NComponent ? ComponentManager<T[K]> : never;
};

type ReadonlyManagersFromClasses<T extends unknown[]> = {
  [K in keyof T]: T[K] extends NComponent ? ReadonlyComponentManager<T[K]> : never;
};

class ComponentManagers<
  ReadCmpts extends NComponent[] = [],
  WriteCmpts extends NComponent[] = [],
  WithoutCmpts extends NComponent[] = [],
> {
  // Complicated type on default value because TypeScript can't
  // enforce that correct data is supplied
  readCMgrs: ReadonlyManagersFromClasses<ReadCmpts>;

  writeCMgrs: ManagersFromClasses<WriteCmpts>;

  withoutCMgrs: ReadonlyManagersFromClasses<WithoutCmpts>;

  constructor({
    readCMgrs,
    writeCMgrs,
    withoutCMgrs,
  }: {
    readCMgrs?: ReadonlyManagersFromClasses<[...ReadCmpts]>;
    writeCMgrs?: ManagersFromClasses<[...WriteCmpts]>;
    withoutCMgrs?: ReadonlyManagersFromClasses<[...WithoutCmpts]>;
  }) {
    // Type complexity here arises from the fact that it's difficult to tell
    // TypeScript that default assignment will only occur when the Cmpts types
    // are also default assigned to []
    this.readCMgrs = readCMgrs ?? ([] as any);
    this.writeCMgrs = writeCMgrs ?? ([] as any);
    this.withoutCMgrs = withoutCMgrs ?? ([] as any);
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
  WithoutCmpts extends NComponent[] = [],
> {
  public readCmpts: ConstructorsFromComponents<[...ReadCmpts]>;

  public writeCmpts: ConstructorsFromComponents<[...WriteCmpts]>;

  public withoutCmpts: ConstructorsFromComponents<[...WithoutCmpts]>;

  constructor({
    readCmpts,
    writeCmpts,
    withoutCmpts,
  }: {
    readCmpts?: ConstructorsFromComponents<[...ReadCmpts]>;
    writeCmpts?: ConstructorsFromComponents<[...WriteCmpts]>;
    withoutCmpts?: ConstructorsFromComponents<[...WithoutCmpts]>;
  }) {
    // Again, type complexity arises from the fact that it's
    // difficult to tell TypeScript that default assignment will
    // only occur when the generic params also default assign
    this.readCmpts = readCmpts ?? ([] as any);
    this.writeCmpts = writeCmpts ?? ([] as any);
    this.withoutCmpts = withoutCmpts ?? ([] as any);
  }

  // Not sure why all these explicit type conversions are necessary.
  // Might be getting messed up by DeepReadonly. Still seems worth it for now, but
  // if this happens again, might be worth stripping out DeepReadonly and only
  // wrapping public-facing engine methods in DeepReadonly.
  public getComponentManagers = (
    eMgr: EntityManager,
  ): ComponentManagers<ReadCmpts, WriteCmpts, WithoutCmpts> => {
    const readCMgrs = this.readCmpts?.map((CClass) =>
      eMgr.tryGetMgr(CClass),
    ) as ReadonlyManagersFromClasses<[...ReadCmpts]>;

    const writeCMgrs = this.writeCmpts?.map((CClass) =>
      eMgr.tryGetMgrMut(CClass),
    ) as ManagersFromClasses<[...WriteCmpts]>;

    const withoutCMgrs = this.withoutCmpts?.map((CClass) =>
      eMgr.tryGetMgr(CClass),
    ) as ReadonlyManagersFromClasses<[...WithoutCmpts]>;

    return new ComponentManagers({ readCMgrs, writeCMgrs, withoutCMgrs });
  };
}

/**
 * Views only need a subset of the component types in ComponentDependencies.
 */
export type PresentComponents<ComponentDependencies extends AbstractComponentClasses> =
  ComponentDependencies extends ComponentClasses<
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

export interface NComponentConstructor<C extends NComponent> {
  new (): C;
}

export type NComponentConstructorCFromCClass<CClass> = CClass extends NComponentConstructor<infer C>
  ? C
  : never;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NComponent {}

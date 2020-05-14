export interface NComponentConstructor<C extends NComponent> {
  new (): C;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NComponent {}

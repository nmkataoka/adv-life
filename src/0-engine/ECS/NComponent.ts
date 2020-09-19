export interface NComponentConstructor<C extends NComponent> {
  new (...rest: any[]): C;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NComponent {}

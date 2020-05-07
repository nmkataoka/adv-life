
export interface NComponentConstructor<C extends NComponent> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(): C;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NComponent {

}
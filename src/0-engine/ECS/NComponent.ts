export interface NComponentConstructor<C> {
  new (...args: any[]): C;

  from<T>(this: NComponentConstructor<T>, data?: Partial<T>): T;
}

export class NComponent {
  /**
   * Works as copy constructor or to load data from pure data type, e.g. json.
   * If the subclass does not have a 0-argument constructor, this must be overridden.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static from<T>(this: NComponentConstructor<T>, data?: Partial<T>): T {
    const c = new this();
    if (data) {
      Object.assign(c, data);
    }
    return c;
  }
}

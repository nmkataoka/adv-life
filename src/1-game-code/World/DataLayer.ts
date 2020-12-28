export class DataLayer {
  data: Float32Array;

  height: number;

  width: number;

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
    this.data = new Float32Array(width * height);
  }

  /** TODO: add cylindrical world wraparound logic */
  at = (x: number, y: number): number => this.data[this.width * y + x];

  /** TODO: add cylindrical world wraparound logic */
  set = (x: number, y: number, val: number): void => {
    this.data[this.width * y + x] = val;
  };
}

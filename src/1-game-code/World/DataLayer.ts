export class DataLayer {
  data: Float32Array;

  height: number;

  width: number;

  metersPerCoord: number;

  constructor(width: number, height: number, metersPerCoord = 25000) {
    this.height = height;
    this.width = width;
    this.data = new Float32Array(width * height);
    this.metersPerCoord = metersPerCoord;
  }

  /** TODO: add cylindrical world wraparound logic */
  at = (x: number, y: number): number => this.data[this.width * y + x];

  /** TODO: add cylindrical world wraparound logic */
  set = (x: number, y: number, val: number): void => {
    this.data[this.width * y + x] = val;
  };
}

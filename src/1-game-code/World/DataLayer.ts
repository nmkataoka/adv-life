export class DataLayer {
  data: Float32Array;

  height: number;

  width: number;

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
    this.data = new Float32Array(width * height);
  }

  at = (x: number, y: number): number => this.data[this.width * y + x];

  set = (x: number, y: number, val: number): void => {
    this.data[this.width * y + x] = val;
  };
}

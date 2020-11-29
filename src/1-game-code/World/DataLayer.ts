export class DataLayer {
  data: Float32Array;

  height: number;

  width: number;

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
    this.data = new Float32Array(width * height);
  }
}

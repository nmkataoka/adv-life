export class DataLayer {
  data: Float32Array;

  height: number;

  width: number;

  name: string;

  metersPerCoord: number;

  isCylindrical: boolean;

  constructor(
    name: string,
    width: number,
    height: number,
    metersPerCoord = 4092,
    isCylindridal = true,
  ) {
    this.name = name;
    this.height = height;
    this.width = width;
    this.data = new Float32Array(width * height);
    this.metersPerCoord = metersPerCoord;
    this.isCylindrical = isCylindridal;
  }

  /** Safe access, but slow */
  at = (x: number, y: number): number => {
    x = ((x % this.width) + this.width) % this.width;
    return this.data[this.width * y + x];
  };

  /** Safe setting, but slow */
  set = (x: number, y: number, val: number): void => {
    x = ((x % this.width) + this.width) % this.width;
    this.data[this.width * y + x] = val;
  };

  setAll = (val: number): void => {
    for (let i = 0; i < this.height * this.width; ++i) {
      this.data[i] = val;
    }
  };
}
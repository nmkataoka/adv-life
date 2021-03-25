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
    metersPerCoord = 4096,
    isCylindridal = true,
  ) {
    this.name = name;
    this.height = height;
    this.width = width;
    this.data = new Float32Array(width * height);
    this.metersPerCoord = metersPerCoord;
    this.isCylindrical = isCylindridal;
  }

  /**
   * Useful for:
   *   1. deserialization
   *   2. creating a new reference to a DataLayer object
   * This is not a deep copy -- assumes the source data will no longer be referenced.
   */
  public static constructFrom(data: Partial<DataLayer> = {}): DataLayer {
    const { name = 'Unknown', width = 0, height = 0, metersPerCoord, isCylindrical } = data;
    const newDataLayer = new DataLayer(name, width, height, metersPerCoord, isCylindrical);
    if (data.data) {
      newDataLayer.data = data.data;
    }
    return newDataLayer;
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

  /** Returns true if y-coordinate is in bounds */
  yIsInBounds = (y: number): boolean => {
    return y > 0 && y < this.height;
  };
}

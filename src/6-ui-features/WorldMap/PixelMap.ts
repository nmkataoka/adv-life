import { DataLayer } from '1-game-code/World';
import { Color } from './Color';

type ColoringFunc = (v: number) => Color;

/** Renders WorldMap by converting from engine data structure to renderable */
export default class PixelMap {
  coloringFunc: ColoringFunc;

  data: Uint8ClampedArray;

  height: number;

  width: number;

  constructor(data: DataLayer, coloringFunc: ColoringFunc) {
    this.height = data.height;
    this.width = data.width;
    this.coloringFunc = coloringFunc;
    this.data = new Uint8ClampedArray(4 * data.data.length);
  }

  updateFromDataLayer = (data: DataLayer): void => {
    if (this.height !== data.height || this.width !== data.width) {
      throw new Error('DataLayer height/width does not match WorldBitmap');
    }

    for (let i = 0; i < data.data.length; ++i) {
      const datum = data.data[i];
      const [r, g, b, a] = this.coloringFunc(datum);

      const renderIdx = i * 4;
      this.data[renderIdx] = r;
      this.data[renderIdx + 1] = g;
      this.data[renderIdx + 2] = b;
      this.data[renderIdx + 3] = a;
    }
  };

  toImageData = (): ImageData => {
    return new ImageData(this.data, this.width, this.height);
  };
}

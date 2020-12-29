import { DataLayer } from '1-game-code/World';
import { Color } from './Color';
import PixelMap from './PixelMap';

global.ImageData = class ImageData {
  constructor(sw: number, sh: number);

  constructor(dataIn: Uint8ClampedArray, sw: number, sh?: number);

  constructor(arg1: number | Uint8ClampedArray, arg2: number, arg3?: number) {
    if (typeof arg1 === 'number') {
      this.data = new Uint8ClampedArray(arg1 * arg2);
      this.height = arg3!;
      this.width = arg2;
    } else {
      this.data = arg1;
      this.height = arg3 ?? Math.floor(this.data.length / arg2);
      this.width = arg2;
    }
  }

  data: Uint8ClampedArray;

  height: number;

  width: number;
};

const black: Color = [0, 0, 0, 255];
const white: Color = [255, 255, 255, 255];

describe('PixelMap', () => {
  it('outputs correct colors for simple map', () => {
    const elevs = new DataLayer(2, 2);
    elevs.set(1, 0, 1);
    elevs.set(0, 1, 2);
    elevs.set(1, 1, 3);
    const coloringFunc = (val: number) => (val > 1 ? white : black);
    const pixelMap = new PixelMap(elevs, coloringFunc);
    pixelMap.updateFromDataLayer(elevs, false);
    expect(pixelMap.data.data).toEqual(new Float32Array([0, 1, 2, 3]));

    const image = pixelMap.toImageData();
    expect(image.data).toEqual(new Uint8ClampedArray([...black, ...black, ...white, ...white]));
  });
});

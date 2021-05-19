import { DataLayer } from '1-game-code/World';
import { Color } from './Color';
import PixelMap from './PixelMap';

const black: Color = [0, 0, 0, 255];
const white: Color = [255, 255, 255, 255];

describe('PixelMap', () => {
  it('outputs correct colors for simple map', () => {
    const elevs = new DataLayer('elevation', 2, 2);
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

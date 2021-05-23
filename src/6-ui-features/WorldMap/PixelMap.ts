import { DataLayer } from '1-game-code/World';
import { consoleWarn } from '8-helpers/console';
import { NMath } from '8-helpers/math';
import assert from 'assert';
import { DeepReadonly } from 'ts-essentials';
import { Color } from './Color';

type ColoringFunc = (v: number) => Color;

type Rgba = [number, number, number, number];

/** Renders WorldMap by converting from engine data structure to renderable */
export default class PixelMap {
  coloringFunc: ColoringFunc;

  private pixels: Uint8ClampedArray;

  data: DataLayer;

  height: number;

  width: number;

  constructor(data: DataLayer | DeepReadonly<DataLayer>, coloringFunc: ColoringFunc) {
    if (data.height === 0 || data.width === 0) {
      consoleWarn('DataLayer should not have 0 width or height.');
    }
    this.height = data.height;
    this.width = data.width;
    this.coloringFunc = coloringFunc;
    this.data = data as DataLayer;
    this.pixels = new Uint8ClampedArray(4 * data.data.length);
  }

  /** Gets the color of a pixel in the pixel map */
  private getPixelColor = (firstIdx: number): Rgba => {
    const r = this.pixels[firstIdx];
    const g = this.pixels[firstIdx + 1];
    const b = this.pixels[firstIdx + 2];
    const a = this.pixels[firstIdx + 3];
    return [r, g, b, a];
  };

  /** Set the color of a pixel in the pixel map */
  private setPixelColor = (firstIdx: number, [r, g, b, a]: Rgba) => {
    this.pixels[firstIdx] = r;
    this.pixels[firstIdx + 1] = g;
    this.pixels[firstIdx + 2] = b;
    this.pixels[firstIdx + 3] = a;
  };

  updateFromDataLayer = (
    data: DataLayer | DeepReadonly<DataLayer>,
    useShearedElev: boolean,
  ): void => {
    if (this.height !== data.height || this.width !== data.width) {
      throw new Error('DataLayer height/width does not match WorldBitmap');
    }

    // De-readonlyify since it's not that helpful
    const d = data as DataLayer;

    this.data = useShearedElev ? shearElevs(d) : d;

    const floatMap = this.data.data;
    for (let i = 0; i < floatMap.length; ++i) {
      const datum = floatMap[i];
      const [r, g, b, a] = this.coloringFunc(datum);
      const renderIdx = i * 4;
      this.setPixelColor(renderIdx, [r, g, b, a]);
    }

    if (useShearedElev) {
      this.applyShading();
    }
  };

  /** When there is a steep drop in the northeast direction,
   * add shading. This causes mountains to cast shadows to the northeast.
   */
  applyShading = (): void => {
    for (let y = this.height - 1; y > 0; --y) {
      for (let x = 1; x < this.width - 1; ++x) {
        const elev = this.data.at(x, y);
        const elevSouth = this.data.at(x, y + 1);
        const elevWest = this.data.at(x - 1, y);
        let totalElevDrop = 0;
        if (elevSouth > elev) totalElevDrop += elevSouth - elev;
        if (elevWest > elev) totalElevDrop += elevWest - elev;
        let shadeFactor = 1 - Math.sqrt(totalElevDrop) * 0.008;
        shadeFactor = NMath.clamp(shadeFactor, 0.8, 1);

        const pixelIdx = (y * this.width + x) * 4;
        const [r, g, b, a] = this.getPixelColor(pixelIdx);
        const newColor: Rgba = [r * shadeFactor, g * shadeFactor, b * shadeFactor, a * shadeFactor];
        this.setPixelColor(pixelIdx, newColor);
      }
    }
  };

  toImageData = (): ImageData => {
    return new ImageData(this.pixels, this.width, this.height);
  };
}

/** Shears map in the y-direction based on elevations so it looks 2.5D.
 *
 * Uses interpolation, so there is loss of data at map edges.
 */
function shearElevs(map: DataLayer, shearFrac = 0.004): DataLayer {
  // Temporary data layer to hold sheared elevations
  const output = new DataLayer('temp', map.width, map.height);
  output.setAll(-1000000);
  /**
   *
   * For each column, start at the bottom of the map. In the output map, stretch
   * the color when elevation is increasing.
   */

  /* Since we are only shearing in 1 dimension, we can process each column
   * of pixels separately.
   */
  for (let x = 0; x < map.width; ++x) {
    /* Start at the bottom of the map */

    /** Tracks our y-position on the input map */
    let inputY = map.height - 1;

    /** Tracks our y-position on the output map */
    let outputY = map.height - 1;

    /** Elevation at inputY */
    let inputElev = map.at(x, inputY);

    /** Tracks where inputY should map to on the output map
     * after displacement due to elevation shearing
     */
    let shearedInputY = inputY - inputElev * shearFrac;

    while (outputY > shearedInputY) {
      /* The elevation is decreasing with decreasing y, and the current pixel on the
       * output map is obstructed by higher elevations in front of it.
       *
       * Skip ahead to where we get out from under the shadow of this
       * mountain.
       */
      --outputY;
    }

    while (outputY >= 0 && inputY - 1 >= 0) {
      assert(outputY <= shearedInputY);
      const nextInputY = inputY - 1;
      const nextInputElev = map.at(x, nextInputY);
      const shearedNextInputY = nextInputY - nextInputElev * shearFrac;

      if (outputY > shearedNextInputY) {
        /* The current outputY lies between shearedY and shearedNextInputY
         *   shearedInputY > outputY > shearedNextInputY
         * so the elevation for outputY can be interpolated between the
         * elevations for inputY and nextInputY
         */

        /** How close outputY is to shearedNextInputY vs shearedInputY */
        const interpFrac = (outputY - shearedInputY) / (shearedNextInputY - shearedInputY);
        const outputElev = interpFrac * (nextInputElev - inputElev) + inputElev;
        output.set(x, outputY, outputElev);

        /** Ready to calculate the elevation for the next pixel in the output map */
        --outputY;
      } else {
        /* The current outputY is not between shearedY and shearedNextInputY
         *   sharedInputY > shearedNextInputY > outputY
         * so the elevation for it can't be interpolated yet
         */
        shearedInputY = shearedNextInputY;
        --inputY;
        inputElev = map.at(x, inputY);
      }
    }
  }
  return output;
}

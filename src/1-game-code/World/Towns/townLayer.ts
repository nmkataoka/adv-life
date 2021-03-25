import { Entity } from '0-engine';
/**
 * Since town data is much sparser than the world map grid resolution (4 km x 4 km),
 * the townLayer uses a lower resolution DataLayer.
 */
export class SparseDataLayer<T> {
  data: T[];

  /** Height of grid in tiles, NOT in distance units. */
  height: number;

  /** Width of grid in tile, NOT in distance units. */
  width: number;

  name: string;

  metersPerCoord: number;

  isCylindrical = true;

  constructor(
    name: string,
    width: number,
    height: number,
    initialize: () => T,
    metersPerCoord = 65536,
  ) {
    this.name = name;
    this.height = height;
    this.width = width;
    this.metersPerCoord = metersPerCoord;
    this.data = [];

    for (let i = 0; i < this.height * this.width; ++i) {
      this.data.push(initialize());
    }
  }
}

export const createTownLayer = (width: number, height: number): SparseDataLayer<Entity> => {
  const sparseWidth = Math.floor(width / 16);
  const sparseHeight = Math.floor(height / 16);
  if (sparseWidth !== width / 16 || sparseHeight !== height / 16) {
    throw new Error('Map height and width must be divisible by 16!');
  }
  return new SparseDataLayer('town', width / 16, height / 16, () => -1);
};

import SimplexNoise from '10-simplex-noise';
import { DataLayer } from '../DataLayer/DataLayer';
import { WorldMap } from '../WorldMap';

export function createConstantRainLayer(width: number, height: number): DataLayer {
  const rainLayer = new DataLayer(WorldMap.Layer.Rain, width, height);
  rainLayer.setAll(1);
  return rainLayer;
}

export function createRandomRainLayer(width: number, height: number): DataLayer {
  const rainLayer = new DataLayer(WorldMap.Layer.Rain, width, height);
  const n = new SimplexNoise('test', {
    frequency: 0.001,
    octaves: 8,
  });
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      rainLayer.set(x, y, n.noise2D(x, y));
    }
  }
  return rainLayer;
}

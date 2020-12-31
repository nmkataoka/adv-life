import { DataLayer } from '../DataLayer/DataLayer';
import { WorldMap } from '../WorldMap';

export function createConstantRainLayer(width: number, height: number): DataLayer {
  const rainLayer = new DataLayer(WorldMap.Layer.Rain, width, height);
  rainLayer.setAll(1);
  return rainLayer;
}

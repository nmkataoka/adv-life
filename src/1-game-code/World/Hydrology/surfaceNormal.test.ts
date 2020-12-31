import { DataLayer } from '../DataLayer/DataLayer';
import { WorldMap } from '../WorldMap';
import { surfaceNormal } from './surfaceNormal';

describe('surfaceNormal', () => {
  it('returns correct norm for flat ground', () => {
    const elevs = new DataLayer(WorldMap.Layer.Elevation, 3, 3, 1, false);
    elevs.setAll(0);
    const norm = surfaceNormal(elevs, [1, 1], 1);
    const [x, y, z] = norm;
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(1);
  });
});

import SimplexNoise from '10-simplex-noise';
import { DataLayer } from '../../DataLayer/DataLayer';

/** Drop in replacement for the entire terrain generation system,
 * mostly for debugging.
 */
export function createRandomTerrain(): DataLayer {
  const elevations = new DataLayer(400, 300);
  const simplex = new SimplexNoise('seed', { frequency: 0.005, octaves: 8 });
  for (let y = 0; y < elevations.height; ++y) {
    for (let x = 0; x < elevations.width; ++x) {
      elevations.data[y * elevations.width + x] = simplex.noise2D(x, y) * 5000;
    }
  }
  return elevations;
}

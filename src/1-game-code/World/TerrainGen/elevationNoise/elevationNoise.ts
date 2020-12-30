import SimplexNoise from '10-simplex-noise';
import { DataLayer } from '../../DataLayer/DataLayer';

/** For some reason, this noise generator seems to have a tendency to eat
 * away at landmasses, so I added this bias to shift the noise up.
 */
const landBias = -0.1;

const scaling = 10000;

/** This noise generator is primarily made to break up the artificial fault lines.
 * It is not affected by hilliness.
 */
export function lowFreqNoise(elevLayer: DataLayer): void {
  const { metersPerCoord, width, height } = elevLayer;
  const noise = new SimplexNoise('test', {
    frequency: 1.2 * 10 ** -7 * metersPerCoord,
    octaves: 8,
    lacunarity: 2.0,
    gain: 0.5,
  });
  for (let xi = 0; xi < width; ++xi) {
    for (let yi = 0; yi < height; ++yi) {
      elevLayer.set(xi, yi, elevLayer.at(xi, yi) + scaling * (landBias + noise.noise2D(xi, yi)));
    }
  }
}

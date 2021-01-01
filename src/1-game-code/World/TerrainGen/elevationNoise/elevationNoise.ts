import { NoiseParams } from '1-game-code/Noise';
import SimplexNoise from '10-simplex-noise';
import { DataLayer } from '../../DataLayer/DataLayer';

/** For some reason, this noise generator seems to have a tendency to eat
 * away at landmasses, so I added this bias to shift the noise up.
 */
const landBias = 0.1;

/** This noise generator is primarily made to break up the artificial fault lines.
 * It is not affected by hilliness.
 */
export function lowFreqNoise(elevLayer: DataLayer, noiseParams: NoiseParams): void {
  const { width, height } = elevLayer;
  const { scale, frequency, octaves, lacunarity, gain } = noiseParams;
  const noise = new SimplexNoise('test', {
    frequency,
    octaves,
    lacunarity,
    gain,
  });
  for (let xi = 0; xi < width; ++xi) {
    for (let yi = 0; yi < height; ++yi) {
      elevLayer.set(xi, yi, elevLayer.at(xi, yi) + scale * (landBias + noise.noise2D(xi, yi)));
    }
  }
}

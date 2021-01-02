import { NoiseParams } from '1-game-code/Noise';
import SimplexNoise from '10-simplex-noise';
import { DataLayer } from '../../DataLayer/DataLayer';

/** Since the max continental plate elevation is only ~1000m, if lowFreqNoise
 * outputs a negative value below -1000, it can turn huge swaths of continent
 * into shallow ocean.
 *
 * However, it's very difficult to control here, and it's better controlled via
 * the scale of lowFreqNoise, so this is a very small bias.
 */
const landBias = 0.05;

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

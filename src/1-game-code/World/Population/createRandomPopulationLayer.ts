import { generateRandomString, Random } from '1-game-code/prng';
import SimplexNoise from '10-simplex-noise';
import { DataLayer } from '../DataLayer/DataLayer';

export function createRandomPopulationLayer(width: number, height: number, rng: Random): DataLayer {
  const popLayer = new DataLayer('population', width, height);
  const seed = generateRandomString(rng);

  // TODO: fix frequency at least
  const noise = new SimplexNoise(seed);
  for (let yi = 0; yi < height; ++yi) {
    for (let xi = 0; xi < width; ++xi) {
      // Average population density was in the 5-60 people per square mile range.
      // For us, each tile is 4km x 4 km, which corresponds to 16 sq km or 6 sq mi.
      // Since 60 people per sq mi was approaching city-level and later medieval ages,
      // we'll start at the lower end.
      //
      // 5 people per sq mi => 30 people per 16 sq km tile
      const val = noise.noise2D(xi, yi) * 30;
      popLayer.set(xi, yi, val);
    }
  }
  return popLayer;
}

import { generateRandomString, Random } from '1-game-code/prng';
import SimplexNoise from '10-simplex-noise';
import { DataLayer } from '../DataLayer/DataLayer';

export function createRandomPopulationLayer(elevLayer: DataLayer, rng: Random): DataLayer {
  const { width, height } = elevLayer;
  const popLayer = new DataLayer('population', width, height);
  const seed = generateRandomString(rng);

  const noise = new SimplexNoise(seed);
  for (let yi = 0; yi < height; ++yi) {
    for (let xi = 0; xi < width; ++xi) {
      // For now, people can't live underwater
      if (elevLayer.at(xi, yi) < 0) {
        popLayer.set(xi, yi, 0);
      } else {
        // Average population density was in the 5-60 people per sq mi range (2 - 23 people per sq km).
        const val = noise.noise2D(xi, yi) * 3;
        popLayer.set(xi, yi, val);
      }
    }
  }
  return popLayer;
}

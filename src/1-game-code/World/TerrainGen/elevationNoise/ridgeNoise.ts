import { NoiseParams } from '1-game-code/Noise';
import { DataLayer } from '1-game-code/World/DataLayer/DataLayer';
import SimplexNoise from '10-simplex-noise';

// Full upward bias, we're only interested in adding mountains not subtracing them
const landBias = 0.98;

export function ridgeNoise(
  elevLayer: DataLayer,
  hillinessLayer: DataLayer,
  noiseParams: NoiseParams,
): void {
  // TODO: this noise should be shifted to 3D and wrap around for cylindrical maps
  const { height, width } = elevLayer;
  const { frequency, octaves, lacunarity, gain } = noiseParams;
  const noise = new SimplexNoise('test', {
    frequency,
    octaves,
    lacunarity,
    gain,
  });

  for (let yi = 0; yi < height; ++yi) {
    for (let xi = 0; xi < width; ++xi) {
      const hilliness = hillinessLayer.at(xi, yi);
      const elev = elevLayer.at(xi, yi);
      elevLayer.set(xi, yi, elev + (hilliness * noise.noise2D(xi, yi) + landBias));
    }
  }
}

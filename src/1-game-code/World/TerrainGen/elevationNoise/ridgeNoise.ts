import { DataLayer } from '1-game-code/World/DataLayer/DataLayer';
import SimplexNoise from '10-simplex-noise';

// Full upward bias, we're only interested in adding mountains not subtracing them
const landBias = 0.95;

export function ridgeNoise(elevLayer: DataLayer, hillinessLayer: DataLayer): void {
  // TODO: this noise should be shifted to 3D and wrap around for cylindrical maps
  const { height, width, metersPerCoord } = elevLayer;
  const noise = new SimplexNoise('test', {
    frequency: 3 * 10 ** -6 * metersPerCoord,
    octaves: 10,
    lacunarity: 2,
    gain: 0.55,
  });

  for (let yi = 0; yi < height; ++yi) {
    for (let xi = 0; xi < width; ++xi) {
      const hilliness = hillinessLayer.at(xi, yi);
      const elev = elevLayer.at(xi, yi);
      elevLayer.set(xi, yi, elev + (hilliness * noise.noise2D(xi, yi) + landBias));
    }
  }
}

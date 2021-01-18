import { DataLayer } from '1-game-code/World/DataLayer/DataLayer';

export type ElevationMetadata = {
  maxElevation: number;
  minElevation: number;
  elevationDistribution: {
    underwater: number;
    low: number;
    medium: number;
    high: number;
  };
};

/** Calculates useful overall statistics related to the elevation layer */
export function calculateElevationMetadata(elevLayer: DataLayer): ElevationMetadata {
  let minElev = 10000;
  let maxElev = -10000;
  const elevationDistribution = {
    underwater: 0,
    low: 0,
    medium: 0,
    high: 0,
  };
  for (let y = 0; y < elevLayer.height; ++y) {
    for (let x = 0; x < elevLayer.width; ++x) {
      const elev = elevLayer.at(x, y);
      if (elev < minElev) minElev = elev;
      if (elev > maxElev) maxElev = elev;

      if (elev < 0) {
        elevationDistribution.underwater += 1;
      } else if (elev < 1500) {
        elevationDistribution.low += 1;
      } else if (elev < 3000) {
        elevationDistribution.medium += 1;
      } else {
        elevationDistribution.high += 1;
      }
    }
  }

  // Turn `elevationDistribution` into a fraction instead of total
  const total = elevLayer.height * elevLayer.width;
  Object.keys(elevationDistribution).forEach((key) => {
    elevationDistribution[key as keyof typeof elevationDistribution] /= total;
  });

  return {
    maxElevation: maxElev,
    minElevation: minElev,
    elevationDistribution,
  };
}

import { DataLayer } from '../DataLayer/DataLayer';

export function createFoodLayer(elevLayer: DataLayer, rainLayer: DataLayer): DataLayer {
  const { height, width } = elevLayer;
  const foodLayer = new DataLayer('food', width, height);

  for (let yi = 0; yi < height; ++yi) {
    // Sunlight is based on latitude so we can calculate it here
    const equator = height / 2;

    // This should be in range [0, 1)
    const sunlight = 1 - Math.abs(yi - equator) / equator;

    // Any sunlight greater than 8 hrs a day doesn't increase fertility.
    const sunAdjusted = Math.min(0.67, sunlight);

    for (let xi = 0; xi < width; ++xi) {
      const elev = elevLayer.at(xi, yi);
      // No population below elev 0 (underwater)
      if (elev > 0) {
        // This should be scaled in cm and considering 100cm is Earth's average rainfall
        const rain = rainLayer.at(xi, yi);

        // Any rain greater than 100 cm doesn't increase fertility.
        // Realistically, it should decrease it for many crops.
        const rainAdjusted = Math.min(100, rain);

        // Food should be in the range 0 - 1000 (or whatever the max rainfall is in cm)
        const food = sunAdjusted * rainAdjusted;
        foodLayer.set(xi, yi, food);
      }
    }
  }

  return foodLayer;
}

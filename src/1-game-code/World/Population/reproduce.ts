import { DataLayer } from '../DataLayer/DataLayer';

export function reproduce({
  elevLayer,
  popLayer,
  rainLayer,
}: {
  elevLayer: DataLayer;
  popLayer: DataLayer;
  rainLayer: DataLayer;
}): void {
  const { height, width } = elevLayer;
  let peopleBorn = 0;
  let peopleDied = 0;
  for (let yi = 0; yi < height; ++yi) {
    for (let xi = 0; xi < width; ++xi) {
      const elev = elevLayer.at(xi, yi);
      // No population below elev 0 (underwater)
      if (elev > 0) {
        // This should be scaled considering 100cm is Earth's average rainfall
        const rain = rainLayer.at(xi, yi);

        // More sun => more food
        const equator = height / 2;

        // This should be in range [0, 1)
        const sunlight = 1 - Math.abs(yi - equator) / equator;

        // Maximum yield per acre is limited by agricultural technology
        // Currently these units are meaningless
        const food = sunlight * rain;

        // TODO: towns/cities should have much higher capacity
        const carryingCapacity = Math.min(food * 0.6, 60);

        // Pop approaches carrying capacity
        const pop = popLayer.at(xi, yi);
        const popChange = 0.1 * (carryingCapacity - pop);
        if (pop < carryingCapacity) {
          peopleBorn += popChange;
        } else {
          peopleDied -= popChange;
        }
        popLayer.set(xi, yi, pop + popChange);
      }
    }
  }

  const { metersPerCoord } = elevLayer;
  console.log('people born:', (peopleBorn * metersPerCoord * metersPerCoord) / 1_000_000);
  console.log(
    'people died of starvation:',
    (peopleDied * metersPerCoord * metersPerCoord) / 1_000_000,
  );
}

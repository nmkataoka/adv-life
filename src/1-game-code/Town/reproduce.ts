import { DataLayer } from '1-game-code/World';
// import { generateVoronoi } from '1-game-code/World/TerrainGen/Voronoi/Voronoi';
// import { Vector2 } from '8-helpers/math';
import { TownCmpt } from './TownCmpt';

/** Number of years it takes pop to double in optimal conditions */
const popDoublesInYears = 150;

/** The annual reproduction rate under optimal conditions based on popDoublesInYears */
const maxRepro = 2 ** (1 / popDoublesInYears);

/**
 * Increase town populations based on food supplies, annual.
 * @param townCmpts Array of mutable town components
 * @param foodLayer The food data layer
 * @param rng World rng
 * @returns Statistics on a per-civ basis
 */
export function reproduce(townCmpts: TownCmpt[], foodLayer: DataLayer): void {
  // const points = townCmpts.map(({ location: [x, y] }) => new Vector2(x, y));
  // const { height, width } = foodLayer;

  /**
   * Towns have influence over all nearby tiles that:
   * - Are closest to this town
   * - Are within the maximum influence range
   *
   * To answer the first bullet, we need a voronoi diagram.
   */
  // const vor = generateVoronoi(points, width, height, 0, Math, true);

  townCmpts.forEach((townCmpt) => {
    const { location, population } = townCmpt;
    const [x, y] = location;

    // Temporary approximation, should be replaced by voronoi calculation
    const food = foodLayer.at(x, y) * 16;

    // Food is currently in a 0-1000ish range, feed population at an arbitrary ratio of food per pop
    if (food < population) {
      // If food can't support population, people are starving :(
      // Right now that means a pop decrease.
      // In future work, probably still have a few births just more deaths.

      // Approaches 50% towards the sustainable population
      const newPopulation = (food + population) / 2;
      townCmpt.population = newPopulation;
    } else {
      // If there's lots of food, make people.
      // TODO: vary reproduction rate based on food
      const newPopulation = population * maxRepro;

      // Let's not worry about max pop right now. We can do immigration in a separate pass
      townCmpt.population = newPopulation;
    }
  });
}

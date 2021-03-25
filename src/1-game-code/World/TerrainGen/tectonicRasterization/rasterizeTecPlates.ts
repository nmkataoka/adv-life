import { Random } from '1-game-code/prng';
import { fillInHoles } from './fillInHoles';
import { DataLayer } from '../../DataLayer/DataLayer';
import { TecPlate } from '../TecPlate';
import { shapeCoasts } from './shapeCoasts';
import { Tectonics } from '../Tectonics';
import { rasterizeFaults } from './rasterizeFaults';
import { propagateElevationsFromFaults } from './propagateElevationsFromFaults';

/** Note: this used to be a global constant. After setting hillHilliness and mountainHilliness through
 * the frontend, haven't figured out what to do with defaultHilliness yet, so just hardcoding as 1.
 */
const defaultHilliness = 1;

type Slopes = { coastSlope: number; ridgeSlope: number; riftSlope: number };

export function rasterizeTectonics(
  { height, width, numPlates, faults, tecPlates }: Tectonics,
  { coastSlope, ridgeSlope, riftSlope }: Slopes,
  maxHilliness: number,
  rng: Random,
  debug = false,
): { elevLayer: DataLayer; hillinessLayer: DataLayer } {
  const elevLayer = new DataLayer('elevation', width, height);
  // Note that default uninitialized value is 11 million
  elevLayer.setAll(-11000000);
  rasterizeFaults(elevLayer, faults);
  fillInHoles(elevLayer, numPlates);
  shapeCoasts(elevLayer, faults, tecPlates, coastSlope, rng);

  const hillinessLayer = new DataLayer('hilliness', width, height);
  hillinessLayer.setAll(defaultHilliness);
  propagateElevationsFromFaults(
    elevLayer,
    hillinessLayer,
    faults,
    { ridgeSlope, riftSlope },
    maxHilliness,
    rng,
  );

  if (debug) {
    debugTecPlates(elevLayer, tecPlates);
  }
  return { elevLayer, hillinessLayer };
}

/** Draws the tec plate centers onto the map */
function debugTecPlates(elevLayer: DataLayer, tecPlates: TecPlate[]) {
  tecPlates.forEach((tecPlate) => {
    const { center } = tecPlate;
    const xStart = Math.floor(center.x) - 5;
    const yStart = Math.floor(center.y) - 5;
    for (let x = xStart; x < xStart + 10; ++x) {
      for (let y = yStart; y < yStart + 10; ++y) {
        elevLayer.set(x, y, 3000);
      }
    }
  });
}

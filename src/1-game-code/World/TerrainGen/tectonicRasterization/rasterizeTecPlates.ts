import { fillInHoles } from './fillInHoles';
import { DataLayer } from '../../DataLayer/DataLayer';
import { TecPlate } from '../TecPlate';
import { shapeCoasts } from './shapeCoasts';
import { Tectonics } from '../Tectonics';
import { rasterizeFaults } from './rasterizeFaults';
import { propagateElevationsFromFaults } from './propagateElevationsFromFaults';

export function rasterizeTectonics(
  { height, width, numPlates, faults, tecPlates }: Tectonics,
  debug = false,
): DataLayer {
  const elevLayer = new DataLayer(width, height);
  // Note that default uninitialized value is 11 million
  elevLayer.setAll(-11000000);
  rasterizeFaults(elevLayer, faults);
  fillInHoles(elevLayer, numPlates);
  shapeCoasts(elevLayer, faults, tecPlates);
  propagateElevationsFromFaults(elevLayer, faults);

  if (debug) {
    debugTecPlates(elevLayer, tecPlates);
  }
  return elevLayer;
}

/** Draws the tec plate centers onto the map */
function debugTecPlates(elevLayer: DataLayer, tecPlates: TecPlate[]) {
  tecPlates.forEach((tecPlate) => {
    const { center } = tecPlate;
    const xStart = Math.floor(center[0]) - 5;
    const yStart = Math.floor(center[1]) - 5;
    for (let x = xStart; x < xStart + 10; ++x) {
      for (let y = yStart; y < yStart + 10; ++y) {
        elevLayer.set(x, y, 3000);
      }
    }
  });
}

import { WorldMap } from '1-game-code/World/WorldMap';
import { fillInHoles } from './fillInHoles';
import { DataLayer } from '../../DataLayer/DataLayer';
import { TecPlate } from '../TecPlate';
import { shapeCoasts } from './shapeCoasts';
import { Tectonics } from '../Tectonics';
import { rasterizeFaults } from './rasterizeFaults';
import { propagateElevationsFromFaults } from './propagateElevationsFromFaults';
import { defaultHilliness } from './constants';

export function rasterizeTectonics(
  { height, width, numPlates, faults, tecPlates }: Tectonics,
  debug = false,
): { elevLayer: DataLayer; hillinessLayer: DataLayer } {
  const elevLayer = new DataLayer(WorldMap.Layer.Elevation, width, height);
  // Note that default uninitialized value is 11 million
  elevLayer.setAll(-11000000);
  rasterizeFaults(elevLayer, faults);
  fillInHoles(elevLayer, numPlates);
  shapeCoasts(elevLayer, faults, tecPlates);

  const hillinessLayer = new DataLayer(WorldMap.Layer.Hilliness, width, height);
  hillinessLayer.setAll(defaultHilliness);
  propagateElevationsFromFaults(elevLayer, hillinessLayer, faults);

  if (debug) {
    debugTecPlates(elevLayer, tecPlates);
  }
  return { elevLayer, hillinessLayer };
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

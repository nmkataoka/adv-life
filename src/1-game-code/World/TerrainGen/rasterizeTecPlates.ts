import assert from 'assert';
import { multiply } from '8-helpers/math/Vector2';
import { fillInHoles } from './fillInHoles';
import { DataLayer } from '../DataLayer';
import { getBaseElevation, TecPlate } from './TecPlate';
import { simpleBresenham } from './simpleBresenham';
import { Fault } from './Fault';
import { shapeCoasts } from './shapeCoasts';
import { Tectonics } from './Tectonics';

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

/** Start rasterizing from vector representation of TecPlates to a grid.
 * First up is the faults.
 */
function rasterizeFaults(elevLayer: DataLayer, faults: Fault[]) {
  const { height } = elevLayer;
  for (let i = 0; i < faults.length; ++i) {
    const fault = faults[i];
    const { normalDir, tecPlateHigher, tecPlateLower, vertices } = fault;
    const higherElev = getBaseElevation(tecPlateHigher);
    const lowerElev = getBaseElevation(tecPlateLower);

    assert(vertices.length > 1);

    // We need to write the plate elevations on either side of the fault
    // just wide enough to ensure no gaps so the floodfill algorithm works
    // Elevation profiles are propagated in parallelograms between fault vertices
    // in the direction of normalDir (and its negative)

    // Apply elevations along the ridge
    for (let curIdx = 1; curIdx < vertices.length; ++curIdx) {
      const cur = vertices[curIdx];
      const prev = vertices[curIdx - 1];
      // Note that this is why the normalDir must point towards the higher tec plate
      simpleBresenham(prev, cur, normalDir, 5, (x: number, y: number) => {
        if (y < height && y >= 0) {
          elevLayer.set(x, y, higherElev);
        }
      });
      simpleBresenham(prev, cur, multiply(normalDir, -1), 5, (x: number, y: number) => {
        if (y < height && y >= 0) {
          elevLayer.set(x, y, lowerElev);
        }
      });
    }
  }
}

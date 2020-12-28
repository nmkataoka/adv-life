import assert from 'assert';
import { multiply, subtract } from '8-helpers/math/Vector2';
import { fillInHoles } from './fillInHoles';
import { DataLayer } from '../DataLayer';
import { getBaseElevation } from './TecPlate';
import { simpleBresenham } from './simpleBresenham';
import { Fault } from './Fault';

export function rasterizeTecPlates(elevLayer: DataLayer, numPlates: number, faults: Fault[]): void {
  fillInHoles(elevLayer, numPlates);
  rasterizeFaults(elevLayer, faults);
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

    assert(vertices.length > 2);

    // We need to write the plate elevations on either side of the fault
    // just wide enough to ensure no gaps so the floodfill algorithm works
    // Elevation profiles are propagated in parallelograms between fault vertices
    // in the direction of normalDir (and its negative)

    // Apply elevations along the ridge
    for (let curIdx = 1; curIdx < vertices.length; ++curIdx) {
      const cur = vertices[curIdx];
      const prev = vertices[curIdx - 1];
      const fSegSlope = subtract(cur, prev);
      simpleBresenham(prev, cur, fSegSlope, normalDir, 5, (x: number, y: number) => {
        if (y < height && y >= 0) {
          elevLayer.set(x, y, higherElev);
        }
      });
      simpleBresenham(prev, cur, fSegSlope, multiply(normalDir, -1), 5, (x: number, y: number) => {
        if (y < height && y >= 0) {
          elevLayer.set(x, y, lowerElev);
        }
      });
    }
  }
}

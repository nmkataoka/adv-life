import { DataLayer } from '../../DataLayer/DataLayer';
import { getBaseElevation } from '../TecPlate';
import { simpleBresenham } from './simpleBresenham';
import { Fault } from '../Fault';

/** Start rasterizing from vector representation of TecPlates to a grid.
 * First up is the faults.
 */
export function rasterizeFaults(elevLayer: DataLayer, faults: Fault[]): void {
  const { height } = elevLayer;
  for (let i = 0; i < faults.length; ++i) {
    const fault = faults[i];
    const { normalDir, tecPlateHigher, tecPlateLower, vertices } = fault;
    const higherElev = getBaseElevation(tecPlateHigher);
    const lowerElev = getBaseElevation(tecPlateLower);

    if (vertices.length < 2) {
      throw new Error("Can't rasterize a fault with only one vertex.");
    }

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
      simpleBresenham(prev, cur, normalDir.multScalar(-1), 5, (x: number, y: number) => {
        if (y < height && y >= 0) {
          elevLayer.set(x, y, lowerElev);
        }
      });
    }
  }
}

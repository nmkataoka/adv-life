import { fillInHoles } from './fillInHoles';
import { DataLayer } from '../DataLayer';

export function rasterizeTecPlates(elevLayer: DataLayer, numPlates: number): void {
  fillInHoles(elevLayer, numPlates);
  rasterizeFaults();
}

/** Start rasterizing from vector representation of TecPlates to a grid.
 * First up is the faults.
 */
function rasterizeFaults() {
  // We need to write the plate elevations on either side of the fault
  // just wide enough to ensure no gaps so the floodfill algorithm works
  // Elevation profiles are propagated in parallelograms between fault vertices
  // in the direction of normalDir (and its negative)
}

import { initializeArrayWithValue } from '8-helpers/ArrayExtensions';
import { RingQueue } from '8-helpers/containers/RingQueue';
import { toVec2i, Vector2 } from '8-helpers/math/Vector2';
import { DataLayer } from '../DataLayer';
import { Fault } from './Fault';
import { floodfillFromFault } from './floodfillFromFault';
import { TecPlate } from './TecPlate';

export function shapeCoasts(elevLayer: DataLayer, faults: Fault[], tecPlates: TecPlate[]): void {
  const { height, width } = elevLayer;
  const coastDistanceMap: number[] = initializeArrayWithValue(height * width, 1000000);
  const processed: boolean[] = initializeArrayWithValue(height * width, false);

  faults.forEach((fault) => {
    // Check that fault is ocean-continental fault
    if (!fault.tecPlateLower.isOceanic || fault.tecPlateHigher.isOceanic) {
      return;
    }

    // Floodfill continent to build out the distance to coast map
    floodfillFromFault(
      elevLayer,
      fault,
      [0, 0],
      1000000, // Effectively infinite. Floodfill till you run into something
      0,
      (x: number, y: number, t: number) => {
        const idx = x + y * width;
        if (coastDistanceMap[idx] > t) {
          coastDistanceMap[idx] = t;
        }
      },
      // Don't add water tiles!
      (x: number, y: number) => elevLayer.at(x, y) >= 0,
    );
  });

  /** Apply an elevation function based on distance from coast
   *
   * At t = 0, elevation = coastal shelf at -150m.
   * Slope up at 25m / 100,000m until reach continent elevation.
   *
   * Floodfill from continent centers.
   */
  const slope = 25 / 100000;
  tecPlates.forEach((tecPlate) => {
    const { center, isOceanic } = tecPlate;
    if (isOceanic) return;

    const floodQueue = new RingQueue<Vector2>();
    floodQueue.push(toVec2i(center));
    processed[center[0] + center[1] * width] = true;

    while (!floodQueue.isEmpty()) {
      const cur = floodQueue.pop();
      const [x, y] = cur;
      const t = coastDistanceMap[x + y * width];
      const newElev = elevLayer.metersPerCoord * slope * t - 150;
      const oldElev = elevLayer.at(x, y);

      // Why does this work? Don't we initialize elevations to -1,000,000?
      // I think at this point the continents are already filled and now we are shaving them
      // down towards the oceans.
      if (newElev < oldElev) {
        elevLayer.set(x, y, newElev);
      }

      // Add adjacent cells
      const addCellIfUnprocessed = (newX: number, newY: number) => {
        newX = ((newX % width) + width) % width;
        const idx = newX + newY * width;

        // Not sure why this check was added and then commented out
        // const newT = coastDistanceMap[idx];
        if (!processed[idx] /* && newT <= t */) {
          floodQueue.push([newX, newY]);
          processed[idx] = true;
        }
      };

      if (y < height - 1) {
        addCellIfUnprocessed(x, y + 1);
      }
      if (y > 0) {
        addCellIfUnprocessed(x, y - 1);
      }
      addCellIfUnprocessed(x - 1, y);
      addCellIfUnprocessed(x + 1, y);
    }
  });
}

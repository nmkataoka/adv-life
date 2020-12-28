import { initializeArrayWithValue, shuffle } from '8-helpers/ArrayExtensions';
import { RingQueue } from '8-helpers/containers/RingQueue';
import { Vector2 } from '8-helpers/math';
import { add, dist, multiply, subtract } from '8-helpers/math/Vector2';
import { DataLayer } from '../DataLayer';
import { Fault } from './Fault';
import { simpleBresenham } from './simpleBresenham';

type TilePropagator = {
  coord: Vector2;
  origin: Vector2;
};

/** Applies a function in a breadth-first-search from a fault (which can be shifted).
 *
 * To stop the BFS, either supply a `maxTilesFromFault` or a checkFunc.
 * If t > maxTilesFromFault or if checkFunc is true, the tile will not
 * be added to the queue.
 *
 * Can be supplied a noise generator to randomize the search to prevent
 * artifacts from cropping up.
 */
export function floodfillFromFault(
  elevLayer: DataLayer,
  fault: Fault,
  shift: Vector2,
  maxTilesFromFault: number,
  skipSegments: number,
  tileFunc: (x: number, y: number, t: number) => void,
  checkFunc: (x: number, y: number) => boolean,
): void {
  const { normalDir, vertices } = fault;
  if (vertices.length < skipSegments * 2 + 1) return;

  const { height, width } = elevLayer;

  /** Marks tiles already added to the queue */
  const alreadyProcessed: boolean[] = initializeArrayWithValue(height * width, false);

  const toProcessStartingArray: TilePropagator[] = [];

  // Fill the queue with starting points
  if (skipSegments < 0) {
    skipSegments = 0;
  }
  for (let curIdx = 1; curIdx < vertices.length - skipSegments; ++curIdx) {
    const cur = vertices[curIdx];
    const prev = vertices[curIdx - 1];
    const fSegSlope = subtract(cur, prev);
    simpleBresenham(
      add(prev, shift),
      add(cur, shift),
      fSegSlope,
      normalDir,
      3,
      addTileToStartingQueue,
    );
    simpleBresenham(
      add(prev, shift),
      add(cur, shift),
      fSegSlope,
      multiply(normalDir, -1),
      3,
      addTileToStartingQueue,
    );
  }

  function addTileToStartingQueue(x: number, y: number): void {
    x = ((x % width) + width) % width;
    const idx = x + y * width;
    if (!alreadyProcessed[idx]) {
      alreadyProcessed[idx] = true;
      if (!checkFunc || checkFunc(x, y)) {
        toProcessQueue.push({ coord: [x, y], origin: [x, y] });
      }
    }
  }

  // Scramble the starting queue to prevent artifacts/patterns arising from the starting order
  shuffle(toProcessStartingArray);

  /** Breadth-first search with a profile function.
   * Queue holds the profile vector, tiles, how far away from the fault they are. */
  const toProcessQueue = RingQueue.fromArray(toProcessStartingArray);

  // Breadth-first search from the fault, applying the elevation and hilliness profile
  while (!toProcessQueue.isEmpty()) {
    // Pop next queue member and retrieve info
    const { coord, origin } = toProcessQueue.pop();
    const [x, y] = coord;
    const t = dist(coord, origin);

    // TODO: Noise t
    // ...

    // If we have reached the end of the profile, stop
    // Note: when relevant, maxTilesFromFault MUST map to the end of the profile.
    //       If not, we'll segfault when indexing into the profile in tileFunc()
    if (Math.floor(t) >= maxTilesFromFault) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // Apply the function
    tileFunc(x, y, Math.floor(t));

    // Add adjacent cells to queue if they have not been processed
    const addTileToQueue = (newX: number, newY: number): void => {
      newX = ((newX % width) + width) % width;
      const idx = newX + newY * width;
      if (!alreadyProcessed[idx]) {
        alreadyProcessed[idx] = true;
        if (!checkFunc || checkFunc(newX, newY)) {
          toProcessQueue.push({ coord: [newX, newY], origin });
        }
      }
    };

    addTileToQueue(x - 1, y);
    addTileToQueue(x + 1, y);
    if (y > 0) {
      addTileToQueue(x, y - 1);
    }
    if (y < height - 1) {
      addTileToQueue(x, y + 1);
    }
  }
}

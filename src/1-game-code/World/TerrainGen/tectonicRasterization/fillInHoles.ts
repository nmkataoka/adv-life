import { initializeArrayWithValue } from '8-helpers/ArrayExtensions';
import { RingQueue } from '8-helpers/containers/RingQueue';
import { Vector2 } from '8-helpers/math';
import { DataLayer } from '../../DataLayer';

export function fillInHoles(elevLayer: DataLayer, numPlates: number): void {
  let allFilled = true;
  do {
    allFilled = true;
    for (let xIdx = 0; xIdx < elevLayer.width; ++xIdx) {
      for (let yIdx = 0; yIdx < elevLayer.height; ++yIdx) {
        if (elevLayer.at(xIdx, yIdx) < -1000000) {
          allFilled = false;
          fillHole(elevLayer, xIdx, yIdx, numPlates);
        }
      }
    }
  } while (!allFilled);
}

function fillHole(elevLayer: DataLayer, xStart: number, yStart: number, numPlates: number) {
  const elevation = findMostCommonElevationOnHoleBorder(
    elevLayer,
    { x: xStart, y: yStart },
    numPlates,
  );

  if (elevation < -1000000) {
    throw new Error('Most common elevation on hole border was the `uninitialized` value.');
  }

  // const defaultHilliness = 0.25;

  /** Queue for floodfill */
  const blank = new RingQueue<Vector2>();
  blank.push([xStart, yStart]);

  // Fill in starting tile
  elevLayer.set(xStart, yStart, elevation);
  const { height } = elevLayer;

  // Floodfill hole
  while (!blank.isEmpty()) {
    const [x, y] = blank.pop();

    // Add neighboring tiles if blank
    fillTileAndAddToQueueIfBlank(x + 1, y);
    fillTileAndAddToQueueIfBlank(x - 1, y);
    if (y + 1 < height) {
      fillTileAndAddToQueueIfBlank(x, y + 1);
    }
    if (y - 1 >= 0) {
      fillTileAndAddToQueueIfBlank(x, y - 1);
    }
  }

  function fillTileAndAddToQueueIfBlank(x: number, y: number): void {
    const elev = elevLayer.at(x, y);
    if (elev < -2000000) {
      elevLayer.set(x, y, elevation);
      blank.push([x, y]);
    }
  }
}

/** Goes directly west until the hole border is reached.
 * Assumes the given coordinates are inside the hole.
 */
function goWestUntilHoleBorderIsReached(elevLayer: DataLayer, x: number, y: number) {
  const { width } = elevLayer;

  while (elevLayer.at(x, y) < -1000000) {
    --x;
    if (x < 0) {
      x = width - 1;
    }
  }
  ++x;
  if (x > width - 1) {
    x = 0;
  }
  return { x, y };
}

function getNextIdx(neighbors: number[], startIdx: number) {
  let idx = startIdx + 1;
  while (idx !== startIdx) {
    if (idx === 8) {
      idx = 0;
    }

    // Note that this check differentiates between neighbors that don't exist (-1 mil) and neighbors with uninitialized elevations (-11 mil)
    if (neighbors[idx] < -1500000) {
      return idx;
    }
    ++idx;
  }
  // Error
  return 8;
}

/**
 * When an empty slot is found, trace the hole in a clockwise manner.
 * Track all border tile elevations found with a counter for frequency.
 * When you return to the initial tile, choose the elevation with the highest counter.
 *
 * @param coords Integer coordinates of any tile inside the hole.
 * @param numPlates Number of tectonic plates. Not super important, just used for a heuristic.
 *
 * WARNING: will infinite loop on some maps if the hard numEncountered limit is removed
 */
export function findMostCommonElevationOnHoleBorder(
  elevLayer: DataLayer,
  coords: { x: number; y: number },
  numPlates: number,
): number {
  const { height, width } = elevLayer;
  const { x: xStart, y: yStart } = goWestUntilHoleBorderIsReached(elevLayer, coords.x, coords.y);
  let x = xStart;
  let y = yStart;

  /** Keeps track of found border elevations */
  const borderElevations: number[] = [];

  /** Tracks number of occurrences of each border elevation. Must be kept in
   * sync with borderElevations.
   */
  const numEncountered: number[] = [];
  let totalEncountered = 0;
  const encounteredThreshold = 10 * Math.sqrt((width * height) / numPlates / 3);

  /** Neighboring blocks
   *     True means empty
   *     False means an elevation exists there
   * Our main coordinate can only travel to empty spaces adjacent to full spaces.
   * Neighbors array is in clockwise order starting with NW:
   *     [NW, N, NE, E, SE, S, SW, W]
   */
  const neighbors = initializeArrayWithValue(8, -2000000);

  /** Sticky block is the filled-in block we're "sticking" to in order to remaiun on the border */
  let stickyIdx = 7;

  do {
    /** Check if totalEncountered exceeds threshold
     * WARNING: Do not remove this check!
     * The algorithm is bugged and this fixes it.
     * Many maps will infinitely loop non-trivially (very large loops) without this.
     *
     * Besides, statistically speaking, it's unnecessary to check the entire border.
     * You only need maybe half to get a good idea of what elevation you should fill
     * the hole with.
     *
     * If you want to find the actual bug, likely the starting corrds which the loop
     * checks against are somehow not part of the large border loop which it gets
     * stuck in.
     */
    if (totalEncountered > encounteredThreshold) {
      break;
    }

    // Update neighbors
    neighbors[7] = elevLayer.at(x - 1, y);
    neighbors[3] = elevLayer.at(x + 1, y);
    if (y < height - 1) {
      neighbors[0] = elevLayer.at(x - 1, y + 1);
      neighbors[1] = elevLayer.at(x, y + 1);
      neighbors[2] = elevLayer.at(x + 1, y + 1);
    } else {
      // Note that this is -1 mil
      neighbors[0] = -1000000;
      neighbors[1] = -1000000;
      neighbors[2] = -1000000;
    }

    if (y > 0) {
      neighbors[4] = elevLayer.at(x + 1, y - 1);
      neighbors[5] = elevLayer.at(x, y - 1);
      neighbors[6] = elevLayer.at(x - 1, y - 1);
    } else {
      neighbors[4] = -1000000;
      neighbors[5] = -1000000;
      neighbors[6] = -1000000;
    }

    // Add current sticky block to the memories
    const stickyBlockElev = neighbors[stickyIdx];
    const elevIdx = borderElevations.findIndex((elev) => elev === stickyBlockElev);
    if (elevIdx < 0) {
      // New elevation
      borderElevations.push(stickyBlockElev);
      numEncountered.push(1);
    } else if (stickyBlockElev > -1000000) {
      // Increment old elevation, except don't count the empty elevation
      numEncountered[elevIdx]++;
      ++totalEncountered;
    }

    /** Go to the next block/stick block pair
     * Priorities: starting from the "sticky" block, try all neighboring blocks in clockwise order
     *
     * nextIdx -> next sticky idx in current coordinates -> next sticky idx in next coordinates
     * 0 -> 7 -> 5
     * 7 -> 6 -> 5
     * 6 -> 5 -> 3
     * 5 -> 4 -> 3
     * 4 -> 3 -> 1
     * 3 -> 2 -> 1
     * 2 -> 1 -> 7
     * 1 -> 0 -> 7
     */
    const nextIdx = getNextIdx(neighbors, stickyIdx);
    if (nextIdx === 8) {
      // We are surrounded by filled tiles
      return elevLayer.at(x - 1, y);
    }

    if (nextIdx <= 2) {
      ++y;
    } else if (nextIdx >= 4 && nextIdx !== 7) {
      --y;
    }

    if (nextIdx === 0 || nextIdx === 7 || nextIdx === 6) {
      --x;
      if (x <= 0) {
        x = width - 1;
      }
    } else if (nextIdx === 4 || nextIdx === 2 || nextIdx === 3) {
      ++x;
      if (x >= width) {
        x = 0;
      }
    }
    stickyIdx = nextIdx - 2;
    if (stickyIdx < 0) {
      stickyIdx += 8;
    }
    if (stickyIdx % 2 === 0) {
      --stickyIdx;
    }
    if (stickyIdx < 0) {
      stickyIdx += 8;
    }
  } while (x !== xStart || y !== yStart); // These coordinates are likely bugged
  // Sometimes it's possible for the algorithm to lopo without re-encountering these
  // starting coords. The numEncounteredThreshold limit stops this from being an issue.

  // Find the highest numEncountered
  const { idx: maxElementIdx } = numEncountered.reduce(
    ({ idx, max }, el, curIdx) => {
      if (el > max) {
        return { max: el, idx: curIdx };
      }
      return { idx, max };
    },
    { idx: -1, max: -1000000 },
  );
  return borderElevations[maxElementIdx];
}

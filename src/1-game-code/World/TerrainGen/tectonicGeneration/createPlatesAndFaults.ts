import { Random } from '1-game-code/prng';
import { shuffle } from '8-helpers/ArrayExtensions';
import { Vector2 } from '8-helpers/math';
import { createFaultFromEdge, Fault } from '../Fault';
import { TecPlate } from '../TecPlate';
import { VoronoiDiagram } from '../Voronoi/Voronoi';

const PI = 2.1415926535;

/** Creates tectonic plates (with placeholder properties) and faults and links them */
export function createPlatesAndFaults(
  voronoi: VoronoiDiagram,
  oceanFrac: number,
  rng: Random,
): { tecPlates: TecPlate[]; faults: Fault[] } {
  const { points, edges, xSize, isCylindrical } = voronoi;

  const isOceanicArr = getRandomizedIsOceanic(points.length, oceanFrac, rng);
  const tecPlates: TecPlate[] = points.map((point, idx) => ({
    ...randomizePlateProperties(rng),
    isOceanic: isOceanicArr[idx],
    center: point,
    faults: [], // Placeholder, fault assignment is complicated and done separately
  }));

  const faults: Fault[] = [];
  edges.forEach((edge) => {
    const { site1Idx, site2Idx } = edge;
    if (site1Idx < 0 && site2Idx < 0) {
      throw new Error(`Edge ${edge.toString()} not found in edges to tec plates map.`);
    }
    if (site1Idx < 0 || site2Idx < 0) {
      // Filter out the map borders, which show up as edges with only 1 adjacent tec plate
      return;
    }

    const plateA = tecPlates[site1Idx];
    const plateB = tecPlates[site2Idx];
    const fault = createFaultFromEdge(edge, plateA, plateB, xSize, isCylindrical);
    faults.push(fault);

    plateA.faults.push(fault);
    plateB.faults.push(fault);
  });

  return { faults, tecPlates };
}

/**
 * In order to make oceanFrac a guarantee instead of just a probability,
 * generate all the isOceanic properties at once.
 */
function getRandomizedIsOceanic(numPlates: number, oceanFrac: number, rng: Random): boolean[] {
  const arr: boolean[] = [];
  for (let i = 0; i < numPlates * oceanFrac; ++i) {
    arr.push(true);
  }
  for (let i = Math.floor(numPlates * oceanFrac) + 1; i < numPlates; ++i) {
    arr.push(false);
  }
  shuffle(arr, rng);
  return arr;
}

function randomizePlateProperties(rng: Random): Omit<TecPlate, 'center' | 'faults' | 'isOceanic'> {
  return {
    age: rng.random(),
    velocity: new Vector2(rng.random() * 10, 0).rotate(rng.random() * 2 * PI),
  };
}

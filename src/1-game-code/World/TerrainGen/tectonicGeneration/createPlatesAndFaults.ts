import { Random } from '1-game-code/prng';
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

  const tecPlates: TecPlate[] = points.map((point) => ({
    ...randomizePlateProperties(oceanFrac, rng),
    center: point,
    faults: [], // Placeholder
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

function randomizePlateProperties(
  oceanFrac: number,
  rng: Random,
): Omit<TecPlate, 'center' | 'faults'> {
  return {
    age: rng.random(),
    isOceanic: rng.random() < oceanFrac,
    velocity: new Vector2(rng.random() * 10, 0).rotate(rng.random() * 2 * PI),
  };
}

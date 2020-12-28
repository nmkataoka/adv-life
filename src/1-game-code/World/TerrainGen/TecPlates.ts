import { Vector2, rotate } from '8-helpers/math/Vector2';
import { Fault } from './Fault';
import { getBaseElevation, TecPlate } from './TecPlate';
import { generateVoronoi, Edge, Polygon, VoronoiDiagram } from './Voronoi';

export type TecPlates = {
  numPlates: number;
  faults: Fault[];
  tecPlates: TecPlate[];
};

export function generateTecPlates(numPlates: number, xSize: number, ySize: number): TecPlates {
  const voronoi = generateVoronoi(numPlates, xSize, ySize);
  const { tecPlates, faults } = createPlatesAndFaults(voronoi);
  perturbPlateEdges();
  return {
    faults,
    numPlates,
    tecPlates,
  };
}

const oceanFrac = 0.7;
const PI = 2.1415926535;

/** Hashes a 2D point to a 1D integer (stringified) for easy sorting.
 * If points are too close together, hashes will collide.
 */
function hashPoint(point: Vector2, xMax: number, yMax: number): string {
  const [x, y] = point;
  const max = Math.max(xMax, yMax);
  const resolution = 1000000 / max;
  return Math.round((y * xMax + x) * resolution).toString();
}

function hashEdge(edge: Edge, xMax: number, yMax: number): string {
  const p1 = hashPoint(edge[0], xMax, yMax);
  const p2 = hashPoint(edge[1], xMax, yMax);
  return `${p1},${p2}`;
}

/** Create a hashmap of hash edges => TecPlate so we can look up an
 * fault's TecPlates easily. Points must be a minimum distance apart
 * in order to avoid hash collisions.
 */
function hashEdgesToTecPlates(
  tecPlates: TecPlate[],
  pointsToEdges: Polygon[],
  xSize: number,
  ySize: number,
): { [key: string]: TecPlate[] } {
  const hashedEdgesToPoints: { [key: string]: TecPlate[] } = {};
  for (let i = 0; i < tecPlates.length; ++i) {
    const tecPlate = tecPlates[i];
    const edges = pointsToEdges[i];
    for (let j = 0; j < edges.length; ++j) {
      const edge = edges[j];
      const hash = hashEdge(edge, xSize, ySize);

      if (hashedEdgesToPoints[hash] == null) {
        hashedEdgesToPoints[hash] = [];
      }

      if (hashedEdgesToPoints[hash].length > 1) {
        throw new Error(
          'Voronoi cell edge is associated with more than 2 points. This is impossible.',
        );
      }

      hashedEdgesToPoints[hash].push(tecPlate);
    }
  }
  return hashedEdgesToPoints;
}

/** Creates tectonic plates (with placeholder properties) and faults and links them */
function createPlatesAndFaults(
  voronoi: VoronoiDiagram,
): { tecPlates: TecPlate[]; faults: Fault[] } {
  const { points, edges, pointsToEdges, xSize, ySize } = voronoi;

  // Linking up TecPlates to Faults is tricky, so we'll create skeletons of each
  // and then use a hashmap to look up which faults border which tec plates
  const tecPlates: TecPlate[] = points.map((point) => ({
    ...randomizePlateProperties(),
    center: point,
    faults: [], // Placeholder
  }));
  const edgesToTecPlates: { [key: string]: TecPlate[] } = hashEdgesToTecPlates(
    tecPlates,
    pointsToEdges,
    xSize,
    ySize,
  );
  const hashedEdgesToFaults: { [key: string]: Fault } = {};
  const faults: Fault[] = edges.map((edge) => {
    const edgeHash = hashEdge(edge, xSize, ySize);
    const adjacentTecPlates = edgesToTecPlates[edgeHash];
    const [plateA, plateB] = adjacentTecPlates;
    let tecPlateHigher: TecPlate;
    let tecPlateLower: TecPlate;

    if (getBaseElevation(plateA) < getBaseElevation(plateB)) {
      tecPlateHigher = plateB;
      tecPlateLower = plateA;
    } else {
      tecPlateHigher = plateA;
      tecPlateLower = plateB;
    }

    const fault: Fault = {
      tecPlateHigher,
      tecPlateLower,
    };
    hashedEdgesToFaults[edgeHash] = fault;
    return fault;
  });

  // Finally, fill out the `faults` list on each tecplate
  tecPlates.forEach((tecPlate, i) => {
    const plateEdges = pointsToEdges[i];
    plateEdges.forEach((edge) => {
      const fault = hashedEdgesToFaults[hashEdge(edge, xSize, ySize)];
      tecPlate.faults.push(fault);
    });
  });

  return { faults, tecPlates };
}

function randomizePlateProperties(): Omit<TecPlate, 'center' | 'faults'> {
  return {
    age: Math.random(),
    isOceanic: Math.random() < oceanFrac,
    velocity: rotate([Math.random() * 10, 0], Math.random() * 2 * PI),
  };
}

function perturbPlateEdges() {
  // skip this for now
}

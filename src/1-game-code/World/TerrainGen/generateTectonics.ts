import { rotate } from '8-helpers/math/Vector2';
import { createFaultFromEdge, Fault } from './Fault';
import { TecPlate } from './TecPlate';
import { generateVoronoi, VoronoiDiagram } from './Voronoi';
import { Tectonics } from './Tectonics';

export function generateTectonics(numPlates: number, xSize: number, ySize: number): Tectonics {
  const voronoi = generateVoronoi(numPlates, xSize, ySize);
  const { tecPlates, faults } = createPlatesAndFaults(voronoi);
  perturbPlateEdges();
  return {
    faults,
    numPlates,
    tecPlates,
    width: xSize,
    height: ySize,
  };
}

const oceanFrac = 0.7;
const PI = 2.1415926535;

/** Creates tectonic plates (with placeholder properties) and faults and links them */
function createPlatesAndFaults(
  voronoi: VoronoiDiagram,
): { tecPlates: TecPlate[]; faults: Fault[] } {
  const { points, edges, pointsToEdges, edgesToPoints } = voronoi;

  // Linking up TecPlates to Faults is tricky, so we'll create skeletons of each
  // and then use a hashmap to look up which faults border which tec plates
  const tecPlates: TecPlate[] = points.map((point) => ({
    ...randomizePlateProperties(),
    center: point,
    faults: [], // Placeholder
  }));

  const faults: Fault[] = [];
  edges.forEach((edge, edgeIdx) => {
    const adjacentTecPlateIndices = edgesToPoints[edgeIdx];
    if (adjacentTecPlateIndices == null) {
      throw new Error(`Edge ${edge.toString()} not found in edges to tec plates map.`);
    }

    // Filter out the map borders, which show up as edges with only 1 adjacent tec plate
    if (adjacentTecPlateIndices.length < 2) {
      return;
    }

    const [plateAIdx, plateBIdx] = adjacentTecPlateIndices;
    const plateA = tecPlates[plateAIdx];
    const plateB = tecPlates[plateBIdx];
    const fault = createFaultFromEdge(edge, plateA, plateB);
    faults.push(fault);
  });

  // Finally, fill out the `faults` list on each tecplate
  tecPlates.forEach((tecPlate, i) => {
    const plateEdges = pointsToEdges[i];
    tecPlate.faults = plateEdges.map((edgeIdx) => faults[edgeIdx]);
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

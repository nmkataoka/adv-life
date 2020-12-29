import { Vector2 } from '8-helpers/math';
import { add, dist, dot, multiply, norm, subtract } from '8-helpers/math/Vector2';
import { getBaseElevation, TecPlate } from './TecPlate';
import { Edge } from './Voronoi';

export type Fault = {
  /** Original length of the fault before perturbation.
   * After perturbation, it's the length of the fault in its unitVec direction.
   */
  length: number;

  /** Unit vector normal */
  normalDir: Vector2;

  /** Original starting point of the fault before perturbation */
  originalStart: Vector2;

  /** Reference to the adjacent tec plate with higher elevation */
  tecPlateHigher: TecPlate;

  /** Reference to the adjacent tec plate with lower elevation */
  tecPlateLower: TecPlate;

  /** Original direction of the fault before perturbation */
  unitVec: Vector2;

  /** Vertices that make up the fault, minimum 2 */
  vertices: Vector2[];

  /** For cylindrical worlds, y-value where & if the fault crosses the world seam */
  // yCrossVal: number;
};

/** Basically a constructor. Order of plates doesn't matter (this function will sort them). */
export function createFaultFromEdge(edge: Edge, plateA: TecPlate, plateB: TecPlate): Fault {
  let tecPlateHigher: TecPlate;
  let tecPlateLower: TecPlate;

  if (getBaseElevation(plateA) < getBaseElevation(plateB)) {
    tecPlateHigher = plateB;
    tecPlateLower = plateA;
  } else {
    tecPlateHigher = plateA;
    tecPlateLower = plateB;
  }

  const [start, end] = edge;
  // TODO: Do these points need to be sorted via the comparator in Difclone?
  // If everything works without sorting, then let's not sort and remove lessThan module
  const vec = subtract(end, start);
  const length = norm(vec);
  const unitVec = multiply(vec, 1 / length);
  let normalDir: Vector2 = [-unitVec[1], unitVec[0]];

  // normalDir must point toward the higher tec plate (other methods rely on this)
  const midpoint = add(start, multiply(vec, 0.5));
  const towardNormalDir = add(midpoint, normalDir);
  if (dist(towardNormalDir, tecPlateHigher.center) > dist(towardNormalDir, tecPlateLower.center)) {
    normalDir = multiply(normalDir, -1);
  }

  return {
    length,
    normalDir,
    originalStart: start,
    tecPlateHigher,
    tecPlateLower,
    unitVec,
    vertices: edge,
  };
}

/** Returns true if the plates on either side of the fault are both ocean or both land */
export function hasSamePlateTypes(fault: Fault): boolean {
  return fault.tecPlateHigher.isOceanic === fault.tecPlateLower.isOceanic;
}

/** Calculates convergence of the two plates adjacent to this fault.
 * - Positive: convergent
 * - Negative: divergent
 * - Magnitude: speed
 */
export function convergence(fault: Fault): number {
  const { tecPlateHigher, tecPlateLower } = fault;
  const { velocity: velH } = tecPlateHigher;
  const { velocity: velL } = tecPlateLower;
  return dot(velH, velL);
}

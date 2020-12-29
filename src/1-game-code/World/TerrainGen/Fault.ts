import { Vector2 } from '8-helpers/math';
import { add, dist, dot, multiply, norm, subtract } from '8-helpers/math/Vector2';
import { getBaseElevation, TecPlate } from './TecPlate';
import { VorEdge } from './Voronoi/VorEdge';

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

  spansWorldSeam: boolean;

  /** For cylindrical worlds, y-value where & if the fault crosses the world seam */
  // yCrossVal: number;
};

/** Basically a constructor. Order of plates doesn't matter (this function will sort them). */
export function createFaultFromEdge(
  edge: VorEdge,
  plateA: TecPlate,
  plateB: TecPlate,
  worldXSize: number,
  isCylindrical: boolean,
): Fault {
  let tecPlateHigher: TecPlate;
  let tecPlateLower: TecPlate;

  if (getBaseElevation(plateA) < getBaseElevation(plateB)) {
    tecPlateHigher = plateB;
    tecPlateLower = plateA;
  } else {
    tecPlateHigher = plateA;
    tecPlateLower = plateB;
  }

  const { start, end, spansWorldSeam } = edge;

  const vec = subtract(end, start);
  const length = norm(vec);
  const unitVec = multiply(vec, 1 / length);
  let normalDir: Vector2 = [-unitVec[1], unitVec[0]];

  if (
    normalDirIsPointingWrongWay(
      start,
      vec,
      normalDir,
      tecPlateHigher,
      tecPlateLower,
      worldXSize,
      isCylindrical,
    )
  ) {
    normalDir = multiply(normalDir, -1);
  }

  return {
    length,
    normalDir,
    originalStart: start,
    spansWorldSeam,
    tecPlateHigher,
    tecPlateLower,
    unitVec,
    vertices: [start, end],
  };
}

/** Returns true if normalDir is pointing toward lower tec plate instead of higher */
function normalDirIsPointingWrongWay(
  start: Vector2,
  vec: Vector2,
  normalDir: Vector2,
  tecPlateHigher: TecPlate,
  tecPlateLower: TecPlate,
  worldXSize: number,
  isCylindrical: boolean,
): boolean {
  // normalDir must point toward the higher tec plate (other methods rely on this)
  const midpoint = add(start, multiply(vec, 0.5));
  const towardNormalDir = add(midpoint, normalDir);
  const higher = tecPlateHigher.center;
  const lower = tecPlateLower.center;

  let distToHigher: number;
  let distToLower: number;
  if (isCylindrical) {
    // WARNING: this may break down if there are very few tec plates, so that the tec plates near the
    // world seam span past the center of the map
    distToHigher = Math.min(
      dist(towardNormalDir, higher),
      dist(towardNormalDir, add(higher, [worldXSize, 0])),
    );
    distToLower = Math.min(
      dist(towardNormalDir, lower),
      dist(towardNormalDir, add(lower, [worldXSize, 0])),
    );
  } else {
    distToHigher = dist(towardNormalDir, higher);
    distToLower = dist(towardNormalDir, lower);
  }

  return distToHigher > distToLower;
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

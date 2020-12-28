import { Vector2 } from '8-helpers/math';
import { dot } from '8-helpers/math/Vector2';
import { TecPlate } from './TecPlate';

export type Fault = {
  // length: number;
  // normalDir: Vector2;
  // originalStart: Vector2;
  tecPlateHigher: TecPlate;
  tecPlateLower: TecPlate;
  // unitVec: Vector2;
  // vertices: Vector2[];
  /** For cylindrical worlds, y-value where & if the fault crosses the world seam */
  // yCrossVal: number;
};

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

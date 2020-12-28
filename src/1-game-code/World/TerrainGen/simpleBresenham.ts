import { Vector2 } from '8-helpers/math';
import { add, multiply, norm } from '8-helpers/math/Vector2';

/** Slightly less than sqrt(2)/2, ensures no tiles are skipped */
const bresenSpacing = 0.7;

/** Rasterization algorithm. Draws lines parallel to fault slope spaced out
 * sqrt(2)/2 apart using Bresenham's line algorithm, going out from fault.
 *
 * There is an alternate algorithm that involves rasterizing parellograms
 * by breaking them into 4 triangles and assigning profile[(int)distanceToFault].
 * This guarantees optimal profile application, but uses many expensive sqrt()
 * calculations.
 */
export function simpleBresenham(
  prev: Vector2,
  cur: Vector2,
  segmentSlope: Vector2,
  stepDir: Vector2,
  width: number,
  func: (a: number, b: number) => void,
): void {
  const segLength = norm(segmentSlope);
  /** How much we'll step from the fault */
  const stepFromFault = multiply(stepDir, bresenSpacing);
  /** How much we'll step along the Bresenham Line */
  const stepToCur = multiply(segmentSlope, bresenSpacing / segLength);
  const fSteps = Math.floor(segLength / bresenSpacing) + 1;

  let prevStart = prev;
  // Step Bresenham line away from fault
  for (let i = 0; i < width; ++i) {
    let ver = prevStart;
    // Walk along Bresenham line
    for (let j = 0; j < fSteps; ++j) {
      // Apply function (such as assigning an elevation to a point)
      const [x, y] = ver;
      const intifiedX = Math.floor(x);
      const intifiedY = Math.floor(y);
      func(intifiedX, intifiedY);
      ver = add(ver, stepToCur);
    }
    prevStart = add(prevStart, stepFromFault);
  }
}

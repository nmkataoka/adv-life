import { Vector2 } from '8-helpers/math';
import { lessThan } from '../lessThan';

export type VorEdge = {
  start: Vector2;
  end: Vector2;

  /** Index of associated point in the voronoi diagram */
  site1Idx: number;

  /** Index of the other associated point in the voronoi diagram */
  site2Idx: number;

  /** On cylindrical maps, true if it wraps around the edges of the map */
  spansWorldSeam: boolean;

  length: number;
  normalDir: Vector2;
  unitVec: Vector2;
};

/** Helper to make sure edge's points are in the right order, create dummy values */
export function createEdge(a: Vector2, b: Vector2): VorEdge {
  let start: Vector2;
  let end: Vector2;

  // start should always be < than end, simplifies various algorithms like wrapSides
  if (lessThan(a, b) <= 0) {
    start = a;
    end = b;
  } else {
    start = b;
    end = a;
  }

  const vec = end.sub(start);
  const length = vec.length();
  const unitVec = vec.multScalar(1 / length);
  const normalDir: Vector2 = new Vector2(-unitVec.y, unitVec.x);

  return {
    start,
    end,
    length,
    unitVec,
    normalDir,
    site1Idx: -1,
    site2Idx: -1,
    spansWorldSeam: false,
  };
}

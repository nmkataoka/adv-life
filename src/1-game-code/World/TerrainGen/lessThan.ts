import { Vector2 } from '8-helpers/math/Vector2';
import { VorEdge } from './Voronoi/VorEdge';

/** Sorts by x first, then y. Useful if a consistent order is desired for a set map-related points. */
export function lessThan(a: Vector2, b: Vector2): number {
  const [ax, ay] = a;
  const [bx, by] = b;
  if (ax < bx) return -1;
  if (ax === bx) {
    if (ay < by) return -1;
    if (ay === by) return 0;
  }
  return 1;
}

export function compareEdges(a: VorEdge, b: VorEdge): number {
  const startCompare = lessThan(a.start, b.start);
  if (startCompare !== 0) return startCompare;
  return lessThan(a.end, b.end);
}

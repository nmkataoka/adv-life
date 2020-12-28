import { Vector2 } from '8-helpers/math/Vector2';

/** Sorts by x first, then y. Useful if a consistent order is desired for a set map-related points. */
export function lessThan(a: Vector2, b: Vector2): boolean {
  const [ax, ay] = a;
  const [bx, by] = b;
  if (ax < bx) return true;
  if (ax === bx && ay < by) return true;
  return false;
}

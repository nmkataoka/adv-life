const { cos, sin } = Math;
export type Vector2 = [number, number];

/** Returns the integer version of the vector using Math.floor */
export function toVec2i(a: Vector2): Vector2 {
  const [x, y] = a;
  return [Math.floor(x), Math.floor(y)];
}

/** Adds two Vector2 */
export function add(a: Vector2, b: Vector2): Vector2 {
  const [ax, ay] = a;
  const [bx, by] = b;
  return [ax + bx, ay + by];
}

/** Adds `b` to `a` Vector2 (mutates). Returns a reference to self. */
export function addMut(a: Vector2, b: Vector2): Vector2 {
  a[0] += b[0];
  a[1] += b[1];
  return a;
}

/** Calculates the distance to another Vector2 */
export function dist(a: Vector2, b: Vector2): number {
  const [ax, ay] = a;
  const [bx, by] = b;
  const xDiff = ax - bx;
  const yDiff = ay - by;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

/** Returns the dot product */
export function dot(a: Vector2, b: Vector2): number {
  const [ax, ay] = a;
  const [bx, by] = b;
  return ax * bx + ay * by;
}

/** Returns the magnitude of the vector */
export function norm(a: Vector2): number {
  return dot(a, a);
}

/** Rotates a vector by `theta` radians */
export function rotate(a: Vector2, theta: number): Vector2 {
  const [x, y] = a;
  const cosT = cos(theta);
  const sinT = sin(theta);
  return [x * cosT - y * sinT, x * sinT + y * cosT];
}

/** Subtracts `b` from `a` and returns the result as a new Vector2 */
export function subtract(a: Vector2, b: Vector2): Vector2 {
  const [ax, ay] = a;
  const [bx, by] = b;
  return [ax - bx, ay - by];
}

/** Subtracts `b` from `a` in place (mutates). Returns reference to self. */
export function subtractMut(a: Vector2, b: Vector2): Vector2 {
  a[0] -= b[0];
  a[1] -= b[1];
  return a;
}

export function multiply(a: Vector2, c: number): Vector2 {
  return [a[0] * c, a[1] * c];
}

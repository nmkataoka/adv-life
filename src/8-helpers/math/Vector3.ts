export type Vector3 = [number, number, number];

export function cross(a: Vector3, b: Vector3): Vector3 {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}

export function add(a: Vector3, b: Vector3): Vector3 {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  return [ax + bx, ay + by, az + bz];
}

export function multiply(a: Vector3, c: number): Vector3 {
  const [ax, ay, az] = a;
  return [c * ax, c * ay, c * az];
}

/** Returns the norm (magnitude) */
export function norm(a: Vector3): number {
  const [ax, ay, az] = a;
  return Math.sqrt(ax * ax + ay * ay + az * az);
}

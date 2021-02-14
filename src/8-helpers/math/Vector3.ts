export class Vector3 {
  x: number;

  y: number;

  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /** Adds another vector immutably */
  add(a: Vector3): Vector3 {
    return new Vector3(this.x + a.x, this.y + a.y, this.z + a.z);
  }

  /** Adds another vector in place. Returns itself for convenience. */
  addMut(a: Vector3): Vector3 {
    this.x += a.x;
    this.y += a.y;
    this.z += a.z;
    return this;
  }

  /** Returns the cross product immutably */
  cross(b: Vector3): Vector3 {
    const { x: ax, y: ay, z: az } = this;
    const { x: bx, y: by, z: bz } = b;
    return new Vector3(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx);
  }

  /** Multiplies by a scalar immutably */
  multScalar(c: number): Vector3 {
    return new Vector3(this.x * c, this.y * c, this.z * c);
  }

  /** Multiplies by a scalar in place. Returns itself for convenience. */
  multScalarMut(c: number): Vector3 {
    this.x *= c;
    this.y *= c;
    this.z *= c;
    return this;
  }

  /** Returns the magnitude of the vector */
  length(): number {
    const { x, y, z } = this;
    return Math.sqrt(x * x + y * y + z * z);
  }

  toString(): string {
    return `{x:${this.x},y:${this.y},z:${this.z}}`;
  }
}

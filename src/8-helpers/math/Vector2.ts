const { cos, sin } = Math;

export class Vector2 {
  x: number;

  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /** Adds another Vector2 immutably */
  add(a: Vector2): Vector2 {
    return new Vector2(this.x + a.x, this.y + a.y);
  }

  /** Adds another vector in place. Returns itself for convenience. */
  addMut(a: Vector2): Vector2 {
    this.x += a.x;
    this.y += a.y;
    return this;
  }

  /** Subtracts another Vector2 immutably */
  sub(a: Vector2): Vector2 {
    return new Vector2(this.x - a.x, this.y - a.y);
  }

  /** Subtracts another vector in place. Returns itself for convenience. */
  subMut(a: Vector2): Vector2 {
    this.x -= a.x;
    this.y -= a.y;
    return this;
  }

  /** Multiplies by a scalar immutably */
  multScalar(c: number): Vector2 {
    return new Vector2(this.x * c, this.y * c);
  }

  /** Multiplies by a scalar in place. Returns itself for convenience. */
  multScalarMut(c: number): Vector2 {
    this.x *= c;
    this.y *= c;
    return this;
  }

  /** Mimics casting to a integer Vector2 by calling Math.floor */
  toVec2i(): Vector2 {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }

  /** Calculates the distance to another Vector2 */
  dist(a: Vector2): number {
    const xDiff = this.x - a.x;
    const yDiff = this.y - a.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }

  /** Returns the dot product */
  dot(a: Vector2): number {
    return this.x * a.x + this.y * a.y;
  }

  /** Returns the magnitude of the vector */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /** Rotates a vector by `theta` radians immutably */
  rotate(theta: number): Vector2 {
    const cosT = cos(theta);
    const sinT = sin(theta);
    const { x, y } = this;
    return new Vector2(x * cosT - y * sinT, x * sinT + y * cosT);
  }

  /** Rotates in place. Returns itself for convenience. */
  rotateMut(theta: number): Vector2 {
    const cosT = cos(theta);
    const sinT = sin(theta);
    const { x, y } = this;
    this.x = x * cosT - y * sinT;
    this.y = x * sinT + y * cosT;
    return this;
  }

  /** Strict equality of members */
  equals(b: Vector2): boolean {
    return this.x === b.x && this.y === b.y;
  }

  toString(): string {
    return `{x:${this.x}, y:${this.y}}`;
  }
}

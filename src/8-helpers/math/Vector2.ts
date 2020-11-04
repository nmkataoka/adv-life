export class Vector2 {
  public x = 0;

  public y = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /** Adds to another Vector2 */
  public add(b: Vector2): Vector2 {
    return new Vector2(this.x + b.x, this.y + b.y);
  }

  /** Adds `b` to this Vector2 (mutates). Returns a reference to self.
   */
  public addMut(b: Vector2): Vector2 {
    this.x += b.x;
    this.y += b.y;
    return this;
  }

  /** Calculates the distance to another Vector2 */
  public dist(b: Vector2): number {
    const xDiff = this.x - b.x;
    const yDiff = this.y - b.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }

  /** Subtracts another Vector2 and returns the result as a new Vector2 */
  public subtract(b: Vector2): Vector2 {
    return new Vector2(this.x - b.x, this.y - b.y);
  }

  /** Subtracts another Vector2 in place (mutates). Returns reference to self. */
  public subtractMut(b: Vector2): Vector2 {
    this.x -= b.x;
    this.y -= b.y;
    return this;
  }

  /** Multiplies by a scalar and returns as a new vector */
  public multiply(c: number): Vector2 {
    return new Vector2(this.x * c, this.y * c);
  }
}

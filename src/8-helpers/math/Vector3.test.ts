import { Vector3 } from './Vector3';

describe('Vector3', () => {
  it('cross product works', () => {
    const a: Vector3 = new Vector3(2, 3, 4);
    const b: Vector3 = new Vector3(5, 6, 7);
    const r = a.cross(b);
    expect(r.x).toBeCloseTo(-3);
    expect(r.y).toBeCloseTo(6);
    expect(r.z).toBeCloseTo(-3);
  });
});

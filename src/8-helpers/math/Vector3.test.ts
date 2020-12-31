import { cross, Vector3 } from './Vector3';

describe('Vector3', () => {
  it('cross product works', () => {
    const a: Vector3 = [2, 3, 4];
    const b: Vector3 = [5, 6, 7];
    const r = cross(a, b);
    expect(r[0]).toBeCloseTo(-3);
    expect(r[1]).toBeCloseTo(6);
    expect(r[2]).toBeCloseTo(-3);
  });
});

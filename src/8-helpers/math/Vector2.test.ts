import { Vector2 } from './Vector2';

describe('Vector2', () => {
  let a: Vector2;
  let b: Vector2;

  beforeEach(() => {
    a = new Vector2(1, 2);
    b = new Vector2(3, 5);
  });

  it('add returns correct Vector2 and does not mutate', () => {
    const r = a.add(b);
    const s = b.add(a);
    expect(r).toMatchObject({ x: 4, y: 7 });
    expect(s).toMatchObject({ x: 4, y: 7 });
    expect(a).toMatchObject({ x: 1, y: 2 });
  });

  it('addMut returns correct Vector2, mutates, and returns own reference', () => {
    const r = a.addMut(b);
    expect(r).toMatchObject({ x: 4, y: 7 });
  });

  it('dot product', () => {
    const product = a.dot(b);
    expect(product).toEqual(13);
  });

  it('dist returns correct number', () => {
    const r = a.dist(b);
    const s = b.dist(a);
    expect(r).toBe(s);
    expect(r).toBe(Math.sqrt(13));
  });

  it('multScalar returns correct Vector2 and does not mutate', () => {
    const r = a.multScalar(3);
    expect(r).toMatchObject({ x: 3, y: 6 });
    expect(a).toMatchObject({ x: 1, y: 2 });
  });

  it('norm (magnitude)', () => {
    const mag = new Vector2(3, 4).length();
    expect(mag).toBeCloseTo(5);
  });

  it('subtract returns correct Vector2', () => {
    const r = a.sub(b);
    expect(r).toMatchObject({ x: -2, y: -3 });
    expect(a).toMatchObject({ x: 1, y: 2 });
  });

  it('subtractMut returns correct Vector2, mutates, and returns own reference', () => {
    const r = a.subMut(b);
    expect(r).toBe(a);
    expect(r).toMatchObject({ x: -2, y: -3 });
  });

  it('rotate returns the correct Vector2', () => {
    a = new Vector2(1, 0);
    const r = a.rotate(Math.PI / 2);
    expect(r.x).toBeCloseTo(0);
    expect(r.y).toBeCloseTo(1);
  });
});

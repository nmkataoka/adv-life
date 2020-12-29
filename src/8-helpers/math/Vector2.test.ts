import { add, addMut, dist, dot, multiply, norm, subtract, subtractMut, Vector2 } from './Vector2';

describe('Vector2', () => {
  let a: Vector2;
  let b: Vector2;

  beforeEach(() => {
    a = [1, 2];
    b = [3, 5];
  });

  it('add returns correct Vector2 and does not mutate', () => {
    const r = add(a, b);
    const s = add(b, a);
    expect(r).toEqual([4, 7]);
    expect(s).toEqual([4, 7]);
    expect(a).toEqual([1, 2]);
  });

  it('addMut returns correct Vector2, mutates, and returns own reference', () => {
    const r = addMut(a, b);
    expect(r).toEqual([4, 7]);
  });

  it('dot product', () => {
    const product = dot(a, b);
    expect(product).toEqual(13);
  });

  it('dist returns correct number', () => {
    const r = dist(a, b);
    const s = dist(b, a);
    expect(r).toBe(s);
    expect(r).toBe(Math.sqrt(13));
  });

  it('multiply returns correct Vector2 and does not mutate', () => {
    const r = multiply(a, 3);
    expect(r).toEqual([3, 6]);
    expect(a).toEqual([1, 2]);
  });

  it('norm (magnitude)', () => {
    const mag = norm([3, 4]);
    expect(mag).toBeCloseTo(5);
  });

  it('subtract returns correct Vector2', () => {
    const r = subtract(a, b);
    expect(r).toEqual([-2, -3]);
    expect(a).toEqual([1, 2]);
  });

  it('subtractMut returns correct Vector2, mutates, and returns own reference', () => {
    const r = subtractMut(a, b);
    expect(r).toBe(a);
    expect(r).toEqual([-2, -3]);
  });
});

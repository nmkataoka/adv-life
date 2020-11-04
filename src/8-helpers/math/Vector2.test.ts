import { Vector2 } from './Vector2';

describe('Vector2', () => {
  let a: Vector2;
  let b: Vector2;

  beforeEach(() => {
    a = new Vector2(1, 2);
    b = new Vector2(3, 4);
  });

  it('add returns correct Vector2 and does not mutate', () => {
    const r = a.add(b);
    const s = b.add(a);
    expect(r.x).toBe(4);
    expect(s.x).toBe(4);
    expect(r.y).toBe(6);
    expect(s.y).toBe(6);

    expect(a.x).toBe(1);
    expect(a.y).toBe(2);
  });

  it('addMut returns correct Vector2, mutates, and returns own reference', () => {
    const r = a.addMut(b);
    expect(r).toBe(a);
    expect(r.x).toBe(4);
    expect(r.y).toBe(6);
  });

  it('dist returns correct number', () => {
    const r = a.dist(b);
    const s = b.dist(a);
    expect(r).toBe(s);
    expect(r).toBe(Math.sqrt(16 + 36));
  });

  it('multiply returns correct Vector2 and does not mutate', () => {
    const r = a.multiply(3);
    expect(r.x).toBe(3);
    expect(r.y).toBe(6);
    expect(a.x).toBe(1);
    expect(a.y).toBe(2);
  });

  it('subtract returns correct Vector2', () => {
    const r = a.subtract(b);
    expect(r.x).toBe(-2);
    expect(r.y).toBe(-2);
    expect(a.x).toBe(1);
    expect(a.y).toBe(2);
  });

  it('subtractMut returns correct Vector2, mutates, and returns own reference', () => {
    const r = a.subtractMut(b);
    expect(r).toBe(a);
    expect(r.x).toBe(-2);
    expect(r.y).toBe(-2);
  });
});

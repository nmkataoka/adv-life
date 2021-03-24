import { createTownName } from './createTownName';

describe('createTownName', () => {
  it('generates a name', () => {
    const name = createTownName(Math);
    expect(name.length).toBeGreaterThan(0);
  });

  it('generates different names on subsequent calls', () => {
    const name1 = createTownName(Math);
    const name2 = createTownName(Math);
    expect(name1.length).toBeGreaterThan(0);
    expect(name2.length).toBeGreaterThan(0);
    expect(name1).not.toBe(name2);
  });
});

import { createTownName } from './createTownName';

describe('createTownName', () => {
  it('generates a name', () => {
    const name = createTownName(Math);
    expect(name.length).toBeGreaterThan(0);
  });

  it('generates different names on subsequent calls', () => {
    const name1 = createTownName(Math);
    expect(name1.length).toBeGreaterThan(0);

    // Since it's random, it's rarely possible for the same name to generate twice.
    // Just in case, we'll give it a few tries.
    let name2 = createTownName(Math);
    let tries = 1;
    while (name1 === name2 && tries < 10) {
      name2 = createTownName(Math);
      ++tries;
    }

    expect(name1).not.toBe(name2);
  });
});

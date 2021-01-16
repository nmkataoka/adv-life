import { Rng } from './Rng';

/* eslint-disable no-bitwise */
describe('Prng', () => {
  it('random outputs in the [0, 1) range with even distribution', () => {
    const prng = new Rng('testerererasld8f7asp9d8e');
    let min = 1;
    let max = -1;
    let total = 0;
    const numIterations = 3000;
    for (let i = 0; i < numIterations; ++i) {
      const n = prng.random();
      total += n;
      if (n < min) min = n;
      if (n > max) max = n;
    }
    const avgN = total / numIterations;
    expect(avgN).toBeLessThan(0.6);
    expect(avgN).toBeGreaterThan(0.4);
    expect(min).toBeLessThan(0.1);
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeLessThan(1);
    expect(max).toBeGreaterThan(0.9);
  });
});

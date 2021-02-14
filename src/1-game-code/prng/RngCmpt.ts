import { NComponent } from '0-engine';
import { Rng } from './Rng';

const RngNames = ['WorldGen'] as const;

export class RngCmpt extends NComponent {
  constructor(seed?: string) {
    super();
    const firstRng = new Rng(seed);
    this.unusedRngs = [firstRng];
    for (let i = 1; i < 100; ++i) {
      this.unusedRngs.push(this.unusedRngs[i - 1].split());
    }
    // We want to withdraw rngs in the order they were generated just for neatness
    this.unusedRngs.reverse();

    RngNames.forEach((name) => {
      const rng = this.unusedRngs.pop();
      if (!rng) throw new Error('We ran out of rngs to name!');
      this.namedRngs[name] = rng;
    });
  }

  /** In use rngs */
  namedRngs: { [key: string]: Rng } = {};

  /** Unused rngs. We generate extra for extensibility. Splitting off a different
   * number of rngs would break seed backwards compatibility, so we have extra.
   */
  unusedRngs: Rng[];

  /** Retrieves a named rng. */
  getRng(name: typeof RngNames[number]): Rng {
    const rng = this.namedRngs[name];
    if (!rng)
      throw new Error(
        `Rng with name ${name} doesn't exist. Was it misspelled, or is this save from an old version?`,
      );

    return rng;
  }
}

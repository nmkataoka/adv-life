/**
 * Code written using the following references:
 * - seedrandom library https://github.com/davidbau/seedrandom (MIT License, David Bau)
 * - xoshiro C implementations by David Blackman and Sebastiano Vigna, CC license
 */

const JUMP = [0x8764000b, 0xf542d2d3, 0x6fa035c3, 0x77f2db5b] as const;

type RngState = {
  a: number;
  b: number;
  c: number;
  d: number;
  seed: string;
};

/* eslint-disable no-bitwise */
export class Rng {
  a = 0;

  b = 0;

  c = 0;

  d = 0;

  seed: string;

  /** Longer seed the better. If no seed, Math.random is used to create one. */
  constructor(seed?: string) {
    if (!seed) {
      seed = '';
      for (let i = 0; i < 32; ++i) {
        const charCode = 97 + Math.floor(Math.random() * 25);
        seed += String.fromCharCode(charCode);
      }
    }
    this.seed = seed;
    this.a = 1;
    this.b = 2;
    this.c = 3;
    this.d = 4;
    for (let k = 0; k < seed.length + 64; ++k) {
      this.a ^= seed.charCodeAt(k) | 0;
      this.next();
    }
  }

  /** Returns float with 32 bits of randomness between -1 and 1 */
  random(): number {
    return (this.next() >>> 0) / 4294967296;
  }

  /** Returns a random 32-bit uint */
  int32(): number {
    return this.next();
  }

  /** Saves internal state to a plain object */
  save(): RngState {
    const { a, b, c, d, seed } = this;
    return {
      a,
      b,
      c,
      d,
      seed,
    };
  }

  /** Loads internal state from a plain object */
  static load(state: RngState): Rng {
    const rng = new Rng('');
    Object.assign(rng, state);
    return rng;
  }

  /** Deterministically creates a new Rng by skipping ahead 2^64 times. Up to 2^64 splits may be performed. */
  split(): Rng {
    const rng = this.clone();
    rng.jump();
    return rng;
  }

  /** Equivalent to calling next() 2^64 times. */
  private jump(): void {
    let w = 0;
    let x = 0;
    let y = 0;
    let z = 0;
    for (let i = 0; i < JUMP.length; ++i) {
      for (let j = 0; j < 32; ++j) {
        if (JUMP[i] & (1 << j)) {
          w ^= this.a;
          x ^= this.b;
          y ^= this.c;
          z ^= this.d;
        }
        this.next();
      }
    }
    this.a = w;
    this.b = x;
    this.c = y;
    this.d = z;
  }

  /** Creates another rng with identical internal state. Only makes sense to use with jump(). */
  private clone(): Rng {
    return Rng.load(this.save());
  }

  /** Returns a 32 bit uint. Currently uses xoshiro128** 1.1 algorithm. */
  public next(): number {
    // The original algorithm relies on uint 32 being used for calculations.
    // In javascript, since bitwise operations are performed on signed 32-bit integers,
    // we need to use >>> instead of >> to mimic the behavior of right shift in C.
    // This ensures we fill with 0s instead of copying the leftmost bit.
    const result = rotl(this.b * 5, 7) * 9;
    const t = this.b << 9;

    this.c ^= this.a;
    this.d ^= this.b;
    this.b ^= this.c;
    this.a ^= this.d;

    this.c ^= t;
    this.d = rotl(this.d, 11);

    return result >>> 0;
  }
}

/** Returns a uint32 number
 * @param x uint32
 * @param k int
 */
function rotl(x: number, k: number): number {
  const l = x << k;
  const r = x >>> (32 - k);
  return l | r;
}

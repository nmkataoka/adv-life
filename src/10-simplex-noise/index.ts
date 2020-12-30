import SimplexNoiseSimple from 'simplex-noise';

/** Adds multiple octaves to simplex-noise library */
export default class SimplexNoise {
  frequency: number;

  lacunarity: number;

  octaves: number;

  gain: number;

  private generators: SimplexNoiseSimple[] = [];

  constructor(seed?: string, { frequency = 1, octaves = 1, lacunarity = 2, gain = 0.5 } = {}) {
    this.frequency = frequency;
    this.lacunarity = lacunarity;
    this.octaves = octaves;
    this.gain = gain;

    for (let octave = 0; octave < octaves; ++octave) {
      this.generators.push(new SimplexNoiseSimple(seed));
    }
  }

  /** Returns a number between (-1, 1)...I think */
  noise2D = (x: number, y: number): number => {
    let total = 0;
    let freq = this.frequency;
    let amplitude = 1;
    let totalAmplitude = 0; // Used to normalize result to -1 to 1
    for (let octave = 0; octave < this.octaves; ++octave) {
      total += this.generators[octave].noise2D(x * freq, y * freq) * amplitude;
      totalAmplitude += amplitude;
      amplitude *= this.gain;
      freq *= this.lacunarity;
    }
    return total / totalAmplitude;
  };

  noise3D = (x: number, y: number, z: number): number => {
    let total = 0;
    let freq = 1;
    let amplitude = 1;
    let totalAmplitude = 0; // Used to normalize result to -1 to 1
    for (let octave = 0; octave < this.octaves; ++octave) {
      total += this.generators[octave].noise3D(x * freq, y * freq, z * freq) * amplitude;
      totalAmplitude += amplitude;
      amplitude *= this.gain;
      freq *= this.lacunarity;
    }
    return total / totalAmplitude;
  };

  noise4D = (x: number, y: number, z: number, w: number): number => {
    let total = 0;
    let freq = 1;
    let amplitude = 1;
    let totalAmplitude = 0; // Used to normalize result to -1 to 1
    for (let octave = 0; octave < this.octaves; ++octave) {
      total += this.generators[octave].noise4D(x * freq, y * freq, z * freq, w * freq) * amplitude;
      totalAmplitude += amplitude;
      amplitude *= this.gain;
      freq *= this.lacunarity;
    }
    return total / totalAmplitude;
  };
}

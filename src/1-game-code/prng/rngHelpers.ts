import { Random } from './Random';

/** Generates a random string of lowercase letters from an rng.
 *
 * Useful for using a number generator to kickstart a string-seeded noise generator.
 */
export function generateRandomString(rng: Random, length = 16): string {
  let str = '';
  for (let i = 0; i < length; ++i) {
    // Lowercase latin letters are 97-122 in unicode
    const next = Math.floor(rng.random() * 26 + 97);
    str += String.fromCharCode(next);
  }
  return str;
}

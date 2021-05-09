import { generateRandomString } from './rngHelpers';

const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';

describe('generateRandomString', () => {
  it('generates a 16 character string by default of all lowercase letters', () => {
    const str = generateRandomString(Math);
    expect(str).toHaveLength(16);
    for (let i = 0; i < str.length; ++i) {
      try {
        expect(lowercaseLetters).toContain(str[i]);
      } catch {
        throw new Error('Expected random string to be all lowercase English letters.');
      }
    }
  });
});

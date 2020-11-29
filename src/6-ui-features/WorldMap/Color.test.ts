import { colorInterp } from './Color';

describe('Color', () => {
  describe('colorInterp', () => {
    it('interpolates for positive numbers', () => {
      const color = colorInterp(16, 10, 20, [0, 10, 20, 255], [10, 20, 30, 255]);
      expect(color).toEqual([6, 16, 26, 255]);
    });

    it('interpolates for negative numbers', () => {
      const color = colorInterp(-16, -20, -10, [0, 10, 20, 255], [10, 20, 30, 255]);
      expect(color).toEqual([4, 14, 24, 255]);
    });
  });
});

import { swapRemoveAt } from './ArrayExtensions';

describe('ArrayExtensions', () => {
  describe('swapRemoveAt', () => {
    it('should swap and remove', () => {
      const arr = [0, 1, 2, 3, 4, 5];
      swapRemoveAt(arr, 1);
      expect(arr).toEqual([0, 5, 2, 3, 4]);

      swapRemoveAt(arr, 1);
      expect(arr).toEqual([0, 4, 2, 3]);

      swapRemoveAt(arr, 3);
      expect(arr).toEqual([0, 4, 2]);

      swapRemoveAt(arr, 0);
      expect(arr).toEqual([2, 4]);

      swapRemoveAt(arr, 0);
      expect(arr).toEqual([4]);

      swapRemoveAt(arr, 0);
      expect(arr).toEqual([]);
    });
  });
});

import { WorldMap } from '1-game-code/World/WorldMap';
import { DataLayer } from '../../DataLayer/DataLayer';
import { findMostCommonElevationOnHoleBorder } from './fillInHoles';

describe('fillInHoles', () => {
  const empty = -11000000;
  describe('findMostCommonElevationOnHoleBorder', () => {
    it('finds correct elevation in simple case', () => {
      const map = new DataLayer('elevation', 3, 3);
      const data = [
        [1, 1, 1],
        [2, empty, 2],
        [0, 4, 5],
      ];
      data.forEach((row, rowIdx) => row.forEach((el, colIdx) => map.set(rowIdx, colIdx, el)));
      const mostCommonElev = findMostCommonElevationOnHoleBorder(map, { x: 1, y: 1 }, 1);
      expect(mostCommonElev).toEqual(1);
    });

    it('finds correct elevation in larger case', () => {
      const data = [
        [0, empty, empty, 0],
        [3, empty, 3, 3],
        [0, empty, empty, 0],
        [3, 1, empty, 3],
      ];
      const map = new DataLayer('elevation', 4, 4);
      data.forEach((row, rowIdx) => row.forEach((el, colIdx) => map.set(rowIdx, colIdx, el)));
      const mostCommonElev = findMostCommonElevationOnHoleBorder(map, { x: 1, y: 2 }, 2);
      expect(mostCommonElev).toEqual(3);
    });
  });
});

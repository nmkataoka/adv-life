import { createEmptyEntityManager } from '../../../0-engine/ECS/test-helpers/CreateEntityManager';
import { EntityManager } from '../../../0-engine/ECS/EntityManager';
import ConditionSet, { checkMaxPermutations, deleteCandidateEntities } from './ConditionSet';

describe('ConditionSet', () => {
  let eMgr: EntityManager;

  beforeEach(() => {
    eMgr = createEmptyEntityManager();
  });

  describe('helper function', () => {
    describe('checkMaxPermutations ', () => {
      const maxPermutations = 10;

      it('should throw if total permutations are greater than maxPermutations (simple)', () => {
        const candidateEntities: number[][] = [[0], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]];
        expect(() => checkMaxPermutations(candidateEntities, maxPermutations)).toThrow();
      });

      it('should throw if total permutations are greater than maxPermutations (complex)', () => {
        const candidateEntities: number[][] = [[0, 1], [0, 1, 2], [0, 1]];
        expect(() => checkMaxPermutations(candidateEntities, maxPermutations)).toThrow();
      });

      it('should succeed silently if total permutations are '
      + 'less than maxPermutations (simple)', () => {
        const candidateEntities: number[][] = [[0], [0]];
        checkMaxPermutations(candidateEntities, maxPermutations);
      });

      it('should succeed silently if total permutations are '
      + 'less than maxPermutations (simple)', () => {
        const candidateEntities: number[][] = [[0], [0, 1], [0, 1], [0], [0], [0, 1]];
        checkMaxPermutations(candidateEntities, maxPermutations);
      });
    });

    it('deleteCandidateEntities', () => {
      let candidateEntities: number[][] = [[0, 1, 2], [3, 4, 5]];
      let candidatesToDelete: number[][] = [[1, 2], []];
      deleteCandidateEntities(candidateEntities, candidatesToDelete);
      expect(candidateEntities).toEqual([[0], [3, 4, 5]]);

      candidateEntities = [[0, 1, 2], [3, 4, 5]];
      candidatesToDelete = [[0, 1, 2], [0, 1, 2]];
      deleteCandidateEntities(candidateEntities, candidatesToDelete);
      expect(candidateEntities).toEqual([[], []]);
    });

    describe('checkEntityRelationshipsAndComponentComparisonTemplates', () => {
      it('throws when entityRelationships are placed under the smaller entity var index', () => {

      });

      it("returns false when an entity relationship doesn't match (by parent index)", () => {

      });

      it("returns false when an entity relationship doesn't match (by child index)", () => {

      });

      it('throws when componentRelationships are placed under the smaller entity var index', () => {

      });

      it("returns false when a component relationship doesn't match (by parent index)", () => {

      });

      it("returns false when a component relationship doesn't match (by child index)", () => {

      });

      it('returns true if entityBinding is valid', () => {

      });
    });
  });

  describe('bindEntities', () => {
    it('not supplying self should error', () => {
      const condSet = new ConditionSet(1);
      expect(() => condSet.bindEntities(eMgr)).toThrow();
    });

    it('should check max permutations', () => {

    });
  });
});

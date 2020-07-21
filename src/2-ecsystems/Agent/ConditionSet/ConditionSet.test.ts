import { createEmptyEntityManager } from '../../../0-engine/ECS/test-helpers/CreateEntityManager';
import { EntityManager } from '../../../0-engine/ECS/EntityManager';
import ConditionSet, {
  checkMaxPermutations,
  deleteCandidateEntities,
  checkEntityRelationshipsAndComponentComparisonTemplates,
} from './ConditionSet';
import { ComponentComparisonTemplateBase } from './ComponentComparisonTemplate';
import EntityRelationshipTemplate, {
  EntityRelationshipTemplateBase,
  IEntityRelationship,
} from './EntityRelationshipTemplate';
import { NComponent } from '../../../0-engine/ECS/NComponent';

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
      class TestComponent1 implements NComponent, IEntityRelationship {
        public children: number[] = [];

        getChildren(): number[] {
          return this.children;
        }
      }

      let entityBinding: number[];
      let candidate: number;
      let entityRels: [number, EntityRelationshipTemplateBase][];
      let entityRelsByChildIdx: [number, EntityRelationshipTemplateBase][];
      let componentComps: [number, ComponentComparisonTemplateBase][];
      let componentCompsByChildIdx: [number, ComponentComparisonTemplateBase][];
      let entityRel1: EntityRelationshipTemplate<TestComponent1, typeof TestComponent1>;

      beforeEach(() => {
        entityBinding = [];
        candidate = 10;
        entityRels = [];
        entityRelsByChildIdx = [];
        componentComps = [];
        componentCompsByChildIdx = [];

        entityRel1 = new EntityRelationshipTemplate(TestComponent1);
      });

      it('throws when entityRelationships are placed under the smaller entity var index', () => {
        entityBinding = [0, 3, 5];
        entityRels = [[4, entityRel1]];
        expect(() => checkEntityRelationshipsAndComponentComparisonTemplates(
          entityBinding,
          candidate,
          eMgr,
          entityRels,
          entityRelsByChildIdx,
          componentComps,
          componentCompsByChildIdx,
        )).toThrow();

        entityRels = [];
        entityRelsByChildIdx = [[4, entityRel1]];
        expect(() => checkEntityRelationshipsAndComponentComparisonTemplates(
          entityBinding,
          candidate,
          eMgr,
          entityRels,
          entityRelsByChildIdx,
          componentComps,
          componentCompsByChildIdx,
        )).toThrow();
      });

      it("returns false when an entity relationship doesn't match (by parent index)", () => {
        entityBinding = [17, 3, 5];
        const c1 = new TestComponent1();
        c1.children = [2];
        const parent = eMgr.CreateEntity();
        eMgr.AddComponent(parent, c1);
        entityRels = [[0, entityRel1]];

        const result = checkEntityRelationshipsAndComponentComparisonTemplates(
          entityBinding,
          parent.handle,
          eMgr,
          entityRels,
          entityRelsByChildIdx,
          componentComps,
          componentCompsByChildIdx,
        );

        expect(result).toEqual(false);
      });

      it('returns true when an entity relationship matches (by parent index)', () => {
        entityBinding = [17, 3, 5];
        const c1 = new TestComponent1();
        c1.children = [17];
        const parent = eMgr.CreateEntity();
        eMgr.AddComponent(parent, c1);
        entityRels = [[0, entityRel1]];

        const result = checkEntityRelationshipsAndComponentComparisonTemplates(
          entityBinding,
          parent.handle,
          eMgr,
          entityRels,
          entityRelsByChildIdx,
          componentComps,
          componentCompsByChildIdx,
        );

        expect(result).toEqual(true);
      });

      it("returns false when an entity relationship doesn't match (by child index)", () => {

      });

      it('returns true when an entity relationship matches (by child index)', () => {

      });

      it('throws when componentRelationships are placed under the smaller entity var index', () => {

      });

      it("returns false when a component relationship doesn't match (by parent index)", () => {

      });

      it('returns true when a component comparison returns true (by parent index', () => {

      });

      it("returns false when a component relationship doesn't match (by child index)", () => {

      });

      it('returns true when a component comparison returns true (by child index)', () => {

      });

      it('returns true if entityBinding is valid, complex example', () => {

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

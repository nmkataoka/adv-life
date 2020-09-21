import { createEmptyEntityManager } from '0-engine/ECS/test-helpers/CreateEntityManager';
import { EntityManager, NComponent } from '0-engine';
import ConditionSet, {
  checkMaxPermutations,
  deleteCandidateEntities,
  checkEntityRelationshipsAndComponentComparisonTemplates,
} from './ConditionSet';
import ComponentComparisonTemplate, {
  ComponentComparisonTemplateBase,
} from './ComponentComparisonTemplate';
import EntityRelationshipTemplate, {
  EntityRelationshipTemplateBase,
  IEntityRelationship,
} from './EntityRelationshipTemplate';

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
        const candidateEntities: number[][] = [
          [0, 1],
          [0, 1, 2],
          [0, 1],
        ];
        expect(() => checkMaxPermutations(candidateEntities, maxPermutations)).toThrow();
      });

      it('should succeed silently if total permutations are less than maxPermutations (simple)', () => {
        const candidateEntities: number[][] = [[0], [0]];
        checkMaxPermutations(candidateEntities, maxPermutations);
      });

      it('should succeed silently if total permutations are less than maxPermutations (simple)', () => {
        const candidateEntities: number[][] = [[0], [0, 1], [0, 1], [0], [0], [0, 1]];
        checkMaxPermutations(candidateEntities, maxPermutations);
      });
    });

    it('deleteCandidateEntities', () => {
      let candidateEntities: number[][] = [
        [0, 1, 2],
        [3, 4, 5],
      ];
      let candidatesToDelete: number[][] = [[1, 2], []];
      deleteCandidateEntities(candidateEntities, candidatesToDelete);
      expect(candidateEntities).toEqual([[0], [3, 4, 5]]);

      candidateEntities = [
        [0, 1, 2],
        [3, 4, 5],
      ];
      candidatesToDelete = [
        [0, 1, 2],
        [0, 1, 2],
      ];
      deleteCandidateEntities(candidateEntities, candidatesToDelete);
      expect(candidateEntities).toEqual([[], []]);
    });

    describe('checkEntityRelationshipsAndComponentComparisonTemplates', () => {
      class TestComponent1 implements NComponent, IEntityRelationship {
        public children: number[] = [];

        public myNumber = 0;

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
      let componentComp1: ComponentComparisonTemplate<
        TestComponent1,
        typeof TestComponent1,
        TestComponent1,
        typeof TestComponent1
      >;
      let parent: number;
      let child: number;

      const checkRelsAndComps = () =>
        checkEntityRelationshipsAndComponentComparisonTemplates(
          entityBinding,
          candidate,
          eMgr,
          entityRels,
          entityRelsByChildIdx,
          componentComps,
          componentCompsByChildIdx,
        );

      beforeEach(() => {
        parent = eMgr.CreateEntity();
        child = eMgr.CreateEntity();
        entityBinding = [];
        candidate = 10;
        entityRels = [];
        entityRelsByChildIdx = [];
        componentComps = [];
        componentCompsByChildIdx = [];

        entityRel1 = new EntityRelationshipTemplate(TestComponent1);
        componentComp1 = new ComponentComparisonTemplate(
          TestComponent1,
          TestComponent1,
          (a: TestComponent1, b: TestComponent1) => a.myNumber === b.myNumber,
        );
      });

      it('throws when entityRelationships are placed under the smaller entity var index', () => {
        entityBinding = [0, 3, 5];
        entityRels = [[4, entityRel1]];
        candidate = 5;
        expect(checkRelsAndComps).toThrow();

        entityRels = [];
        entityRelsByChildIdx = [[4, entityRel1]];
        candidate = 5;
        expect(checkRelsAndComps).toThrow();
      });

      it("returns false when an entity relationship doesn't match (by parent index)", () => {
        entityBinding = [17, 3, 5];
        const c1 = new TestComponent1();
        c1.children = [2];
        eMgr.AddComponent(parent, c1);
        entityRels = [[0, entityRel1]];
        candidate = parent;

        const result = checkRelsAndComps();

        expect(result).toEqual(false);
      });

      it('returns true when an entity relationship matches (by parent index)', () => {
        entityBinding = [17, 3, 5];
        const c1 = new TestComponent1();
        c1.children = [17];
        eMgr.AddComponent(parent, c1);
        entityRels = [[0, entityRel1]];
        candidate = parent;

        const result = checkRelsAndComps();

        expect(result).toEqual(true);
      });

      it("returns false when an entity relationship doesn't match (by child index)", () => {
        entityBinding = [parent];
        const c1 = new TestComponent1();
        c1.children = [child + 1];
        eMgr.AddComponent(parent, c1);
        entityRelsByChildIdx = [[0, entityRel1]];
        candidate = child;

        const result = checkRelsAndComps();

        expect(result).toEqual(false);
      });

      it('returns true when an entity relationship matches (by child index)', () => {
        entityBinding = [parent];
        const c1 = new TestComponent1();
        c1.children = [child];
        eMgr.AddComponent(parent, c1);
        entityRelsByChildIdx = [[0, entityRel1]];
        candidate = child;

        const result = checkRelsAndComps();

        expect(result).toEqual(true);
      });

      it('throws when componentRelationships are placed under the smaller entity var index', () => {
        entityBinding = [child];
        componentComps = [[0, componentComp1]];
        candidate = parent;
        eMgr.AddComponent(child, new TestComponent1());
        eMgr.AddComponent(parent, new TestComponent1());

        // Make sure the test isn't failing for an unrelated reason
        checkRelsAndComps();

        componentComps = [[1, componentComp1]];
        expect(checkRelsAndComps).toThrow();

        entityBinding = [parent];
        componentComps = [];
        componentCompsByChildIdx = [[5, componentComp1]];
        candidate = child;
        expect(checkRelsAndComps).toThrow();
      });

      const createTestComponents = (parentNum: number, childNum: number) => {
        const parentTestComponent = new TestComponent1();
        parentTestComponent.myNumber = parentNum;
        const childTestComponent = new TestComponent1();
        childTestComponent.myNumber = childNum;
        eMgr.AddComponent(parent, parentTestComponent);
        eMgr.AddComponent(child, childTestComponent);
      };

      it("returns false when a component relationship doesn't match (by parent index)", () => {
        entityBinding = [child];
        componentComps = [[0, componentComp1]];
        candidate = parent;
        createTestComponents(0, 1);
        expect(checkRelsAndComps()).toEqual(false);
      });

      it('returns true when a component comparison returns true (by parent index', () => {
        entityBinding = [child];
        componentComps = [[0, componentComp1]];
        candidate = parent;
        createTestComponents(0, 0);
        expect(checkRelsAndComps()).toEqual(true);
      });

      it("returns false when a component relationship doesn't match (by child index)", () => {
        entityBinding = [parent];
        componentComps = [[0, componentComp1]];
        candidate = child;
        createTestComponents(0, 1);
        expect(checkRelsAndComps()).toEqual(false);
      });

      it('returns true when a component comparison returns true (by child index)', () => {
        entityBinding = [parent];
        componentComps = [[0, componentComp1]];
        candidate = child;
        createTestComponents(0, 0);
        expect(checkRelsAndComps()).toEqual(true);
      });

      it('returns true if entityBinding is valid, complex example', () => {});
    });
  });

  describe('bindEntities', () => {
    it('not supplying self should error', () => {
      const condSet = new ConditionSet(1);
      expect(() => condSet.bindEntities(eMgr)).toThrow();
    });

    it('should check max permutations', () => {});
  });
});

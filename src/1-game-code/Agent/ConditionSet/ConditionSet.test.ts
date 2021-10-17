import { createEmptyEntityManager } from '0-engine/ECS/test-helpers/CreateEntityManager';
import { EntityManager, NComponent, NComponentConstructor } from '0-engine';
import ConditionSet, {
  checkMaxPermutations,
  deleteCandidateEntities,
  checkEntityRelationshipsAndComponentComparisonTemplates,
} from './ConditionSet';
import ComponentComparisonTemplate, {
  ComponentComparisonTemplateBase,
} from './ComponentComparisonTemplate';

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
      class TestComponent1 extends NComponent {
        public anotherEntity = -1;

        public myNumber = 0;
      }

      let entityBinding: number[];
      let candidate: number;
      let entityRels: [number, NComponentConstructor<NComponent>, string][];
      let entityRelsByChildIdx: [number, NComponentConstructor<NComponent>, string][];
      let componentComps: [number, ComponentComparisonTemplateBase][];
      let componentCompsByChildIdx: [number, ComponentComparisonTemplateBase][];
      let componentComp1: ComponentComparisonTemplate<TestComponent1, TestComponent1>;
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
        parent = eMgr.createEntity();
        child = eMgr.createEntity();
        entityBinding = [];
        candidate = 10;
        entityRels = [];
        entityRelsByChildIdx = [];
        componentComps = [];
        componentCompsByChildIdx = [];

        componentComp1 = new ComponentComparisonTemplate(
          TestComponent1,
          TestComponent1,
          (a: TestComponent1, b: TestComponent1) => a.myNumber === b.myNumber,
        );
      });

      it('throws when entityRelationships are placed under the smaller entity var index', () => {
        entityBinding = [0, 3, 5];
        const cmpt = new TestComponent1();
        cmpt.anotherEntity = 0;
        entityRels = [[4, TestComponent1, 'anotherEntity']];
        candidate = 5;
        expect(checkRelsAndComps).toThrow();

        entityRels = [];
        entityRelsByChildIdx = [[4, TestComponent1, 'anotherEntity']];
        candidate = 5;
        expect(checkRelsAndComps).toThrow();
      });

      it("returns false when an entity relationship doesn't match (by parent index)", () => {
        entityBinding = [17, 3, 5];
        const c1 = new TestComponent1();
        c1.anotherEntity = 2;
        eMgr.addCmpt(parent, c1);
        entityRels = [[0, TestComponent1, 'anotherEntity']];
        candidate = parent;

        const result = checkRelsAndComps();

        expect(result).toEqual(false);
      });

      it('returns true when an entity relationship matches (by parent index)', () => {
        entityBinding = [child, 3, 5];
        const c1 = new TestComponent1();
        c1.anotherEntity = child;
        eMgr.addCmpt(parent, c1);
        entityRels = [[0, TestComponent1, 'anotherEntity']];
        candidate = parent;

        const result = checkRelsAndComps();

        expect(result).toEqual(true);
      });

      it("returns false when an entity relationship doesn't match (by child index)", () => {
        entityBinding = [parent];
        const c1 = new TestComponent1();
        c1.anotherEntity = child + 1;
        eMgr.addCmpt(parent, c1);
        entityRelsByChildIdx = [[0, TestComponent1, 'anotherEntity']];
        candidate = child;

        const result = checkRelsAndComps();

        expect(result).toEqual(false);
      });

      it('returns true when an entity relationship matches (by child index)', () => {
        entityBinding = [parent];
        const c1 = new TestComponent1();
        c1.anotherEntity = child;
        eMgr.addCmpt(parent, c1);
        entityRelsByChildIdx = [[0, TestComponent1, 'anotherEntity']];
        candidate = child;

        const result = checkRelsAndComps();

        expect(result).toEqual(true);
      });

      it('throws when componentRelationships are placed under the smaller entity var index', () => {
        entityBinding = [child];
        componentComps = [[0, componentComp1]];
        candidate = parent;
        eMgr.addCmpt(child, new TestComponent1());
        eMgr.addCmpt(parent, new TestComponent1());

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
        eMgr.addCmpt(parent, parentTestComponent);
        const childTestComponent = new TestComponent1();
        childTestComponent.myNumber = childNum;
        eMgr.addCmpt(child, childTestComponent);
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

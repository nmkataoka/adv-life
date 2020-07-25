import { createEmptyEntityManager } from '../../../0-engine/ECS/test-helpers/CreateEntityManager';
import { NComponent } from '../../../0-engine/ECS/NComponent';
import ComponentComparisonTemplate from './ComponentComparisonTemplate';
import { EntityManager } from '../../../0-engine/ECS/EntityManager';

class TestComponent implements NComponent {
  public info = '';
}

describe('ComponentComparisonTemplate', () => {
  let eMgr: EntityManager;

  beforeEach(() => {
    eMgr = createEmptyEntityManager();
  });

  const createEntity = (info: string) => {
    const e = eMgr.CreateEntity();
    const c = new TestComponent();
    c.info = info;
    eMgr.AddComponent(e, c);
    return e.handle;
  };

  const predTrue = () => true;
  const predFalse = () => false;

  it('constructs properly and can run checkValid', () => {
    const e1 = createEntity('e1Component');
    const e2 = createEntity('e2Component');

    const cTemplateTrue = new ComponentComparisonTemplate(TestComponent, TestComponent, predTrue);
    expect(cTemplateTrue.checkValid(e1, e2, eMgr)).toBe(true);

    const cTemplateFalse = new ComponentComparisonTemplate(
      TestComponent,
      TestComponent,
      predFalse,
    );
    expect(cTemplateFalse.checkValid(e1, e2, eMgr)).toBe(false);
  });

  it('checkValid throws when entity is missing necessary component', () => {
    const e1 = createEntity('e1Component');
    const e2 = eMgr.CreateEntity();

    const cTemplate = new ComponentComparisonTemplate(TestComponent, TestComponent, predTrue);
    expect(() => cTemplate.checkValid(e1, e2.handle, eMgr)).toThrow();
  });

  it('checkValid with equality predicate runs properly', () => {
    const predEquality = (c1: TestComponent, c2: TestComponent): boolean => c1.info === c2.info;
    const cTemplate = new ComponentComparisonTemplate(TestComponent, TestComponent, predEquality);

    const e1 = createEntity('e1Component');
    const e2 = createEntity('e2Component');
    expect(cTemplate.checkValid(e1, e2, eMgr)).toBe(false);

    const e3 = createEntity('e1Component');
    expect(cTemplate.checkValid(e1, e3, eMgr)).toBe(true);
  });

  it('checkValid with string length predicate runs properly', () => {
    const predStrLength = (c1: TestComponent, c2: TestComponent): boolean =>
      c1.info.length > c2.info.length;
    const cTemplate = new ComponentComparisonTemplate(TestComponent, TestComponent, predStrLength);

    const e1 = createEntity('e1C');
    const e2 = createEntity('e2Component');
    expect(cTemplate.checkValid(e1, e2, eMgr)).toBe(false);

    const e3 = createEntity('e');
    expect(cTemplate.checkValid(e1, e3, eMgr)).toBe(true);
  });
});

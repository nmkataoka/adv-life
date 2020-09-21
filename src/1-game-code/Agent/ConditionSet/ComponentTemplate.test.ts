import { createEmptyEntityManager } from '0-engine/ECS/test-helpers/CreateEntityManager';
import { NComponent, EntityManager } from '0-engine';
import ComponentTemplate from './ComponentTemplate';

class TestComponent implements NComponent {
  public info = '';
}

describe('ComponentTemplate', () => {
  let eMgr: EntityManager;

  beforeEach(() => {
    eMgr = createEmptyEntityManager();
  });

  const createEntity = (info: string) => {
    const e = eMgr.CreateEntity();
    const c = new TestComponent();
    c.info = info;
    eMgr.AddComponent(e, c);
    return e;
  };

  const predTrue = () => true;
  const predFalse = () => false;

  it('constructs properly and can run checkValid', () => {
    const e1 = createEntity('e1Component');

    const cTemplateTrue = new ComponentTemplate(TestComponent, predTrue);
    expect(cTemplateTrue.checkValid(e1, eMgr)).toBe(true);

    const cTemplateFalse = new ComponentTemplate(TestComponent, predFalse);
    expect(cTemplateFalse.checkValid(e1, eMgr)).toBe(false);
  });

  it('checkValid throws when entity is missing necessary component', () => {
    const e1 = eMgr.CreateEntity();

    const cTemplate = new ComponentTemplate(TestComponent, predTrue);
    expect(() => cTemplate.checkValid(e1, eMgr)).toThrow();
  });

  it('checkValid predicate runs properly', () => {
    const predEquality = (c1: TestComponent): boolean => c1.info === 'e2Component';
    const cTemplate = new ComponentTemplate(TestComponent, predEquality);

    const e1 = createEntity('e1Component');
    expect(cTemplate.checkValid(e1, eMgr)).toBe(false);

    const e2 = createEntity('e2Component');
    expect(cTemplate.checkValid(e2, eMgr)).toBe(true);
  });
});

import { ComponentClasses } from './ComponentDependencies';
import { EntityManager } from './EntityManager';
import { NComponent } from './NComponent';

class TestCmpt implements NComponent {}

describe('View', () => {
  let eMgr: EntityManager;
  beforeEach(() => {
    eMgr = new EntityManager([]);
  });

  it('GetView gets a view with one component', () => {
    const e = eMgr.createEntity();
    eMgr.addCmpt(e, new TestCmpt());

    const view = eMgr.getView(new ComponentClasses({ readCmpts: [TestCmpt] }));
    expect(view.count).toBe(1);
  });
});

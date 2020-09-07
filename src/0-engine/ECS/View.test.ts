import { EntityManager } from './EntityManager';
import { NComponent } from './NComponent';
import { GetView } from './View';

class TestCmpt implements NComponent {}

describe('View', () => {
  let eMgr: EntityManager;
  beforeEach(() => {
    eMgr = new EntityManager();
  });

  it('GetView gets a view with one component', () => {
    const e = eMgr.CreateEntity();
    const testCmpt = new TestCmpt();
    eMgr.AddComponent(e, testCmpt);

    const view = GetView(0, TestCmpt);
    expect(view.Count).toBe(1);
  });
});

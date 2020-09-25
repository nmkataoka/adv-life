import { EntityManager } from './EntityManager';
import { NComponent } from './NComponent';
import { GetView } from './View';

class TestCmpt implements NComponent {}

describe('View', () => {
  let eMgr: EntityManager;
  beforeEach(() => {
    eMgr = new EntityManager([]);
  });

  it('GetView gets a view with one component', () => {
    const e = eMgr.createEntity();
    eMgr.addCmpt(e, TestCmpt);

    const view = GetView(eMgr, 0, TestCmpt);
    expect(view.Count).toBe(1);
  });
});

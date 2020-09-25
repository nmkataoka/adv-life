import { EntityManager } from './EntityManager';
import { NComponent } from './NComponent';

class TestCmpt1 implements NComponent {
  public name = 'TestCmpt1';
}
class TestCmpt2 implements NComponent {
  public name = 'TestCmpt2';
}

it('add and get multiple component managers', () => {
  const eMgr = new EntityManager([]);
  const e = eMgr.createEntity();
  eMgr.addCmpt(e, TestCmpt1);
  eMgr.addCmpt(e, TestCmpt2);

  const cMgr1 = eMgr.tryGetMgrMut(TestCmpt1);
  const cMgr2 = eMgr.tryGetMgrMut(TestCmpt2);
  const fetchedC1 = cMgr1.get(e);
  const fetchedC2 = cMgr2.get(e);
  expect(fetchedC1?.name).not.toBe(fetchedC2?.name);
});

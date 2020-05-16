import { EntityManager } from './EntityManager';
import { NComponent } from './NComponent';

class TestCmpt1 implements NComponent {
  public name = 'TestCmpt1';
}
class TestCmpt2 implements NComponent {
  public name = 'TestCmpt2';
}

it('add and get multiple component managers', () => {
  const eMgr = new EntityManager();
  const e = eMgr.CreateEntity();
  eMgr.AddComponent(e, new TestCmpt1());
  eMgr.AddComponent(e, new TestCmpt2());

  const cMgr1 = eMgr.GetComponentManager(TestCmpt1);
  const cMgr2 = eMgr.GetComponentManager(TestCmpt2);
  const fetchedC1 = cMgr1.Get(e);
  const fetchedC2 = cMgr2.Get(e);
  expect(fetchedC1?.name).not.toBe(fetchedC2?.name);
});

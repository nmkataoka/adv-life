import { EntityManager } from './EntityManager';
import { NComponent } from './NComponent';

class TestCmpt1 implements NComponent {
  public name = 'TestCmpt1';
}
class TestCmpt2 implements NComponent {
  public name = 'TestCmpt2';
}

describe('EntityManager', () => {
  it('add and get multiple component managers', () => {
    const eMgr = new EntityManager([]);
    const e = eMgr.createEntity();
    eMgr.addCmpt(e, new TestCmpt1());
    eMgr.addCmpt(e, new TestCmpt2());

    const cMgr1 = eMgr.tryGetMgrMut(TestCmpt1);
    const cMgr2 = eMgr.tryGetMgrMut(TestCmpt2);
    const fetchedC1 = cMgr1.get(e);
    const fetchedC2 = cMgr2.get(e);
    expect(fetchedC1?.name).not.toBe(fetchedC2?.name);
  });

  it('queueEntityDestruction waits until OnUpdate to delete entities', () => {
    const eMgr = new EntityManager([]);
    const e = eMgr.createEntity();
    const e2 = eMgr.createEntity();
    eMgr.addCmpt(e, new TestCmpt1());
    eMgr.addCmpt(e2, new TestCmpt1());

    eMgr.queueEntityDestruction(e);
    eMgr.queueEntityDestruction(e2);

    let c1 = eMgr.tryGetCmpt(TestCmpt1, e);
    expect(c1).not.toBeUndefined();
    let c2 = eMgr.tryGetCmpt(TestCmpt1, e2);
    expect(c2).not.toBeUndefined();

    eMgr.OnUpdate(1);
    c1 = eMgr.tryGetCmpt(TestCmpt1, e);
    expect(c1).toBeUndefined();
    c2 = eMgr.tryGetCmpt(TestCmpt1, e2);
    expect(c2).toBeUndefined();
  });
});

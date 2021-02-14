import { stub } from 'sinon';
import { EntityManager } from './EntityManager';
import { createEventSlice } from './event-system';
import { NComponent } from './NComponent';
import { Thunk } from './Thunk';

class TestCmpt1 extends NComponent {
  public name = 'TestCmpt1';
}
class TestCmpt2 extends NComponent {
  public name = 'TestCmpt2';
}

describe('EntityManager', () => {
  it('add and get multiple component managers', async () => {
    const eMgr = new EntityManager();
    await eMgr.Start();
    const e = eMgr.createEntity();
    eMgr.addCmpt(e, new TestCmpt1());
    eMgr.addCmpt(e, new TestCmpt2());

    const cMgr1 = eMgr.tryGetMgrMut(TestCmpt1);
    const cMgr2 = eMgr.tryGetMgrMut(TestCmpt2);
    const fetchedC1 = cMgr1.get(e);
    const fetchedC2 = cMgr2.get(e);
    expect(fetchedC1?.name).not.toBe(fetchedC2?.name);
  });

  it('queueEntityDestruction waits until OnUpdate to delete entities', async () => {
    const eMgr = new EntityManager();
    await eMgr.Start();
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

    await eMgr.OnUpdate(1);
    c1 = eMgr.tryGetCmpt(TestCmpt1, e);
    expect(c1).toBeUndefined();
    c2 = eMgr.tryGetCmpt(TestCmpt1, e2);
    expect(c2).toBeUndefined();
  });

  describe('dispatch', () => {
    const setUp = async () => {
      const effect = stub().returns(Promise.resolve());
      const { eventListener, doSomething } = createEventSlice(
        'doSomething',
        {},
      )<number>(({ payload }) => {
        effect(payload);
      });
      const eMgr = new EntityManager();
      await eMgr.Start();
      eMgr.registerEventListener(eventListener.eventType, eventListener);

      return { effect, eMgr, doSomething };
    };

    it('handles actions', async () => {
      const { doSomething, effect, eMgr } = await setUp();
      expect(effect.callCount).toBe(0);
      await eMgr.dispatch(doSomething(1));
      expect(effect.callCount).toBe(1);
    });

    it('handles thunks', async () => {
      const { doSomething, effect, eMgr } = await setUp();
      expect(effect.callCount).toBe(0);
      const thunkCreator = (): Thunk => async (dispatch) => {
        await dispatch(doSomething(1));
        await dispatch(doSomething(2));
        await dispatch(doSomething(3));
      };
      await eMgr.dispatch(thunkCreator());
      expect(effect.callCount).toBe(3);
      expect(effect.getCall(0).args[0]).toBe(1);
      expect(effect.getCall(1).args[0]).toBe(2);
      expect(effect.getCall(2).args[0]).toBe(3);
    });
  });
});

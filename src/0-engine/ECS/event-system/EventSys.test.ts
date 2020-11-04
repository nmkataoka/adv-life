import sinon, { SinonStub } from 'sinon';
import { EntityManager } from '../EntityManager';
import { EventSys } from './EventSys';

describe('EventSys', () => {
  let eMgr: EntityManager;
  let eventSys: EventSys;
  let callback: SinonStub;
  const TEST_EVENT = 'test_event';
  let token: number;

  beforeEach(() => {
    eMgr = new EntityManager([]);
    eventSys = new EventSys(eMgr);
    callback = sinon.stub();
    token = eventSys.RegisterListener(TEST_EVENT, callback);
  });

  it('dispatch defaults to high priority, which results in immediate dispatch', async () => {
    await eventSys.Dispatch({ type: TEST_EVENT, payload: 1 });
    expect(callback.callCount).toBe(1);
    expect(callback.lastCall.args).toEqual([{ eMgr, payload: 1 }]);
  });

  it('dispatch defaults to low priority, which results in the action dispatching on the next OnUpdate', async () => {
    await eventSys.Dispatch({ type: TEST_EVENT, payload: 1 }, true);
    expect(callback.callCount).toBe(0);
    await eventSys.OnUpdate();
    expect(callback.callCount).toBe(1);
    expect(callback.lastCall.args).toEqual([{ eMgr, payload: 1 }]);
  });

  it('remove listener removes the listener', async () => {
    eventSys.RemoveListener(TEST_EVENT, token);
    await eventSys.Dispatch({ type: TEST_EVENT, payload: 1 }, false);
    expect(callback.callCount).toBe(0);
  });
});

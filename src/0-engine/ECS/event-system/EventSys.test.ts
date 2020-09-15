import sinon, { SinonStub } from 'sinon';
import { EntityManager } from '../EntityManager';
import { EventSys } from './EventSys';

describe('EventSys', () => {
  let eMgr: EntityManager;
  let eventSys: EventSys;
  let callback: SinonStub;
  let ack: SinonStub;
  const TEST_EVENT = 'test_event';
  let token: number;

  beforeEach(() => {
    eMgr = new EntityManager([]);
    eventSys = new EventSys(eMgr);
    callback = sinon.stub();
    ack = sinon.stub();
    token = eventSys.RegisterListener(TEST_EVENT, callback);
  });

  it('dispatch defaults to high priority, which results in immediate dispatch', () => {
    eventSys.Dispatch({ type: TEST_EVENT, payload: 1, ack });
    expect(callback.callCount).toBe(1);
    expect(callback.lastCall.args).toEqual([{ ack, eMgr, payload: 1 }]);
  });

  it('dispatch defaults to low priority, which results in the action dispatching on the next OnUpdate', () => {
    eventSys.Dispatch({ type: TEST_EVENT, payload: 1, ack }, true);
    expect(callback.callCount).toBe(0);
    eventSys.OnUpdate();
    expect(callback.callCount).toBe(1);
    expect(callback.lastCall.args).toEqual([{ ack, eMgr, payload: 1 }]);
  });

  it('remove listener removes the listener', () => {
    eventSys.RemoveListener(TEST_EVENT, token);
    eventSys.Dispatch({ type: TEST_EVENT, payload: 1, ack }, false);
    expect(callback.callCount).toBe(0);
  });
});

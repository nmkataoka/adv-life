import sinon, { SinonStub } from 'sinon';
import { ComponentClasses } from '../component-dependencies/ComponentDependencies';
import { createEventSlice } from '.';
import { EntityManager } from '../EntityManager';
import { EventCallback } from './EventCallback';
import { EventListener } from './EventListener';
import { EventSys } from './EventSys';

describe('EventSys', () => {
  let eMgr: EntityManager;
  let eventSys: EventSys;
  let callback: SinonStub;
  let listener: EventListener;
  const TEST_EVENT = 'test_event';
  let token: number;

  beforeEach(() => {
    eMgr = new EntityManager([]);
    eventSys = new EventSys(eMgr);
    callback = sinon.stub();
    listener = createEventSlice(
      TEST_EVENT,
      new ComponentClasses({}),
    )<undefined>(callback as EventCallback).eventListener;
    token = eventSys.RegisterListener(TEST_EVENT, listener);
  });

  it('dispatch defaults to high priority, which results in immediate dispatch', async () => {
    await eventSys.Dispatch({ type: TEST_EVENT, payload: 1 });
    expect(callback.callCount).toBe(1);
    const { eMgr: eMgrReceived, payload } = callback.lastCall.args[0];
    expect(eMgrReceived).toBe(eMgr);
    expect(payload).toEqual(1);
  });

  it('dispatch defaults to low priority, which results in the action dispatching on the next OnUpdate', async () => {
    const promise = eventSys.Dispatch({ type: TEST_EVENT, payload: 1 }, true);
    expect(callback.callCount).toBe(0);
    await eventSys.OnUpdate(1);
    await promise;
    expect(callback.callCount).toBe(1);
    const { eMgr: eMgrReceived, payload } = callback.lastCall.args[0];
    expect(eMgrReceived).toBe(eMgr);
    expect(payload).toEqual(1);
  });

  it('remove listener removes the listener', async () => {
    eventSys.RemoveListener(TEST_EVENT, token);
    await eventSys.Dispatch({ type: TEST_EVENT, payload: 1 }, false);
    expect(callback.callCount).toBe(0);
  });
});

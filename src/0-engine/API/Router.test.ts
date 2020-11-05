import sinon, { SinonStub, SinonStubbedInstance } from 'sinon';
import { EventSys } from '../ECS/event-system';
import { Controller } from './Controller';
import { RequestData, Router } from './Router';

const TEST_ROUTE = 'test_route';

describe('Router', () => {
  let action: SinonStub;
  let router: Router;
  let eventSys: SinonStubbedInstance<EventSys>;
  let requestData: RequestData<number>;
  beforeEach(() => {
    action = sinon.stub();
    class TestController extends Controller {
      public Start = (routerIn: Router): void => {
        routerIn.addRoute(TEST_ROUTE, action);
      };
    }

    requestData = { payload: 9, headers: { userId: 1 } };
    eventSys = sinon.createStubInstance(EventSys);
    router = new Router([TestController]);
  });

  describe('addRoute', () => {
    it('throws an error if the route is already assigned', () => {
      router.Start((eventSys as unknown) as EventSys);
      expect(() => router.addRoute(TEST_ROUTE, async () => {})).toThrowError(
        'Route already has a request handler',
      );
    });

    it('assigns the route handler to the route', () => {});
  });

  describe('handleRequest', () => {
    it('does not call the request handler if eventSys is not set', async () => {
      await router.handleRequest(TEST_ROUTE, requestData);
      expect(action.callCount).toBe(0);
    });

    it('does not break if there is no request handler to handle the request', async () => {
      router.Start((eventSys as unknown) as EventSys);
      await router.handleRequest('nothing', requestData);
      expect(action.callCount).toBe(0);
    });

    it('calls request handler with appropriate arguments', async () => {
      router.Start((eventSys as unknown) as EventSys);
      await router.handleRequest(TEST_ROUTE, requestData);
      expect(action.callCount).toBe(1);
      expect(action.lastCall.args).toEqual([requestData, eventSys.Dispatch]);
    });
  });
});

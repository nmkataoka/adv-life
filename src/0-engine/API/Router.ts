import { Controller, ControllerConstructor } from './Controller';
import { EventSys } from '../ECS/event-system/EventSys';

export type RequestHeaders = { userId: number };
export type RequestData<T> = { payload: T; headers: RequestHeaders };
export type RequestHandler<T> = (
  data: RequestData<T>,
  dispatch: typeof EventSys.prototype.Dispatch,
) => Promise<any>;

export class Router {
  constructor(controllerConstructors: ControllerConstructor<any>[]) {
    controllerConstructors.forEach((Con) => {
      this.controllers.push(new Con());
    });
  }

  public Start = (eventSys: EventSys): void => {
    this.eventSys = eventSys;
    this.controllers.forEach((controller) => {
      controller.Start(this);
    });
  };

  public addRoute = <T>(routeName: string, requestHandler: RequestHandler<T>): void => {
    if (this.routes[routeName]) {
      throw new Error('Route already has a request handler');
    }
    this.routes[routeName] = requestHandler;
  };

  public handleRequest = async <T>(routeName: string, data: RequestData<T>): Promise<any> => {
    const requestHandler = this.routes[routeName];
    let result;
    if (this.eventSys && requestHandler) {
      result = await requestHandler(data, this.eventSys.Dispatch);
    }
    return Promise.resolve(result);
  };

  private controllers: Controller[] = [];

  private routes: { [key: string]: RequestHandler<any> } = {};

  private eventSys?: EventSys;
}

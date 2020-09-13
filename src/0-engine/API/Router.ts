import { Controller, ControllerConstructor } from './Controller';
import { EventSys } from '../ECS/event-system/EventSys';

export type AckCallback = (data: any) => void;
export type RequestHeaders = { userId: number };
export type RequestData<T> = { payload: T; headers: RequestHeaders; ack?: AckCallback };
export type RequestHandler<T> = (data: RequestData<T>, dispatch: typeof EventSys.prototype.Dispatch) => void;

export class Router {
  constructor(controllerConstructors: ControllerConstructor<any>[]) {
    controllerConstructors.forEach((Con) => {
      this.controllers.push(new Con());
    });
  }

  public Start(eventSys: EventSys): void {
    this.eventSys = eventSys;
    this.controllers.forEach((controller) => {
      controller.Start(this);
    });
  }

  public addRoute = <T>(routeName: string, requestHandler: RequestHandler<T>): void => {
    if (this.routes[routeName]) {
      throw new Error('Route already has a request handler');
    }
    this.routes[routeName] = requestHandler;
  };

  public handleRequest = <T>(routeName: string, data: RequestData<T>): void => {
    const requestHandler = this.routes[routeName];
    if (this.eventSys && requestHandler) {
      requestHandler(data, this.eventSys.Dispatch);
    }
  };

  private controllers: Controller[] = [];

  private routes: { [key: string]: RequestHandler<any> } = {};

  private eventSys?: EventSys;
}

import { Router } from './Router';

/* Handles external interactions */
export abstract class Controller {
  public abstract Start(router: Router): void;
}

export interface ControllerConstructor<C extends Controller> {
  new (): C;
}

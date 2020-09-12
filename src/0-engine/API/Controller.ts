/* Handles external interactions */
export abstract class Controller {
  public Start(): void {}
}

export interface ControllerConstructor<C extends Controller> {
  new (): C;
}

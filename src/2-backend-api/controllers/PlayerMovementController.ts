import { Controller, EventSys, RequestData, Router } from '0-engine';
import { SET_PLAYER_DESTINATION as ENGINE_SET_PLAYER_DESTINATION } from '1-game-code/Combat/SetPlayerDestinationSys';
import { Vector2 } from '8-helpers/math';

export const SET_PLAYER_DESTINATION = 'combat/set-player-destination';

const setPlayerDestination = async (
  { headers, payload }: RequestData<{ destination: Vector2 }>,
  dispatch: typeof EventSys.prototype.Dispatch,
): Promise<void> => {
  const { userId } = headers;
  return dispatch({ type: ENGINE_SET_PLAYER_DESTINATION, payload: { ...payload, unitId: userId } });
};

export class PlayerMovementController extends Controller {
  public Start = (router: Router): void => {
    router.addRoute(SET_PLAYER_DESTINATION, setPlayerDestination);
  };
}

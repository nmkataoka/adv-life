import { Controller, RequestData, Router } from '0-engine';
import { EventSys } from '0-engine/ECS/event-system';
import { setPlayerDestination as setPlayerDest } from '1-game-code/Combat/SetPlayerDestinationSys';
import { Vector2 } from '8-helpers/math';

export const SET_PLAYER_DESTINATION = 'combat/set-player-destination';

const setPlayerDestination = async (
  { headers, payload }: RequestData<{ destination: Vector2 }>,
  dispatch: typeof EventSys.prototype.Dispatch,
): Promise<void> => {
  const { userId } = headers;
  return dispatch(setPlayerDest({ ...payload, unitId: userId }));
};

export class PlayerMovementController extends Controller {
  public Start = (router: Router): void => {
    router.addRoute(SET_PLAYER_DESTINATION, setPlayerDestination);
  };
}

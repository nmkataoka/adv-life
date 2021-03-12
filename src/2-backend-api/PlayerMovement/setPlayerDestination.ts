import { Entity, Thunk } from '0-engine';
import { setPlayerDestination as setPlayerDest } from '1-game-code/Combat/SetPlayerDestinationSys';
import { Vector2 } from '8-helpers/math';

export const setPlayerDestination = ({
  userId,
  ...rest
}: {
  destination: Vector2;
  userId: Entity;
}): Thunk => async (dispatch) => dispatch(setPlayerDest({ ...rest, unitId: userId }));

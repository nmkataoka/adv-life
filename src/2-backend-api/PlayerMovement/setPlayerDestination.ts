import { Thunk } from '0-engine';
import { setPlayerDestination as setPlayerDest } from '1-game-code/Combat/SetPlayerDestinationSys';
import apiClient from '3-frontend-api/ApiClient';
import { Vector2 } from '8-helpers/math';

export const setPlayerDestination = (payload: { destination: Vector2 }): Thunk => async (
  dispatch,
) => dispatch(setPlayerDest({ ...payload, unitId: apiClient.headers.userId }));

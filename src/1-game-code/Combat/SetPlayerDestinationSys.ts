import { createEventSlice } from '0-engine';
import { Vector2 } from '8-helpers/math';
import { MovementCmpt } from './MovementCmpt';

export const SET_PLAYER_DESTINATION = 'combat/set-player-destination';

const setPlayerDestinationSlice = createEventSlice('setPlayerDestination', {
  writeCmpts: [MovementCmpt],
})<{
  unitId: number;
  destination: Vector2;
}>(function setPlayerDestination({
  payload: { unitId, destination },
  componentManagers: {
    writeCMgrs: [movementMgr],
  },
}) {
  const movementCmpt = movementMgr.tryGetMut(unitId);
  if (movementCmpt) {
    movementCmpt.destination = destination;
  }
});

export default [setPlayerDestinationSlice.eventListener];

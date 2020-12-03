import { createEventListener, ECSystem, EventSys } from '0-engine';
import { Vector2 } from '8-helpers/math';
import { MovementCmpt } from './MovementCmpt';

export const SET_PLAYER_DESTINATION = 'combat/set-player-destination';

const setPlayerDestinationSlice = createEventListener({ writeCmpts: [MovementCmpt] })<{
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

export class SetPlayerDestinationSys extends ECSystem {
  public Start(): void {
    this.eMgr
      .getSys(EventSys)
      .RegisterListener(SET_PLAYER_DESTINATION, setPlayerDestinationSlice.eventListener);
  }

  public OnUpdate(): void {}
}

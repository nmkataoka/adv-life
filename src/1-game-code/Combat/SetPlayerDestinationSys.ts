import { ECSystem, EventCallbackArgs, EventSys } from '0-engine';
import { Vector2 } from '8-helpers/math';
import { MovementCmpt } from './MovementCmpt';

export const SET_PLAYER_DESTINATION = 'combat/set-player-destination';

const setPlayerDestination = ({
  eMgr,
  payload: { unitId, destination },
}: EventCallbackArgs<{
  unitId: number;
  destination: Vector2;
}>) => {
  const movementCmpt = eMgr.tryGetCmptMut(MovementCmpt, unitId);
  if (movementCmpt) {
    movementCmpt.destination = destination;
  }
};

export class SetPlayerDestinationSys extends ECSystem {
  public Start(): void {
    this.eMgr.getSys(EventSys).RegisterListener(SET_PLAYER_DESTINATION, setPlayerDestination);
  }

  public OnUpdate(): void {}
}

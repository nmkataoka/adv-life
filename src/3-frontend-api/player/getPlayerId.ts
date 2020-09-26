import { EntityManager } from '0-engine';
import { PlayerCmpt } from '1-game-code/ncomponents';

export const getPlayerId = (eMgr: EntityManager): string => {
  const view = eMgr.getView([PlayerCmpt], [], []);
  const player = view.at(0);
  return player;
};

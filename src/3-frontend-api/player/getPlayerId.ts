import { EntityManager } from '0-engine';
import { ComponentClasses } from '0-engine/ECS/ComponentDependencies';
import { PlayerCmpt } from '1-game-code/ncomponents';
import { Selector } from '4-react-ecsal';

export const getPlayerId: Selector<number> = (eMgr: EntityManager) => {
  const view = eMgr.getView(new ComponentClasses({ readCmpts: [PlayerCmpt] }));
  const player = view.at(0);
  return player;
};

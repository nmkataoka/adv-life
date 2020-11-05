import { EntityManager } from '0-engine';
import { NameCmpt } from '1-game-code/ncomponents';
import { Selector } from '4-react-ecsal';

export const getName = (e: number): Selector<NameCmpt> => (eMgr: EntityManager) => {
  return eMgr.getCmpt(NameCmpt, e);
};

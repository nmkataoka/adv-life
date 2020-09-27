import { EntityManager } from '0-engine';
import { NameCmpt } from '1-game-code/ncomponents';

export const getNameCmpt = (e: number) => (eMgr: EntityManager): NameCmpt => {
  return eMgr.getCmpt(NameCmpt, e);
};

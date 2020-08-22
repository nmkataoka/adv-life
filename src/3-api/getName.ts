import { GameManager } from '../0-engine/GameManager';
import { NameCmpt } from '../1-ncomponents';

export const getNameCmpt = (entityHandle: number): NameCmpt => {
  const { eMgr } = GameManager.instance;
  return eMgr.GetComponent(NameCmpt, entityHandle);
};

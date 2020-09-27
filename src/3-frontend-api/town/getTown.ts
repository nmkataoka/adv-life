import { EntityManager, NameCmpt } from '0-engine';
import { TownLocationsCmpt } from '1-game-code/Town';
import { DeepReadonly } from 'ts-essentials';
import { defaultTownInfo, TownInfo } from './TownInfo';

export const getTown = (townId: number) => (eMgr: EntityManager): DeepReadonly<TownInfo> => {
  if (townId < 0) return defaultTownInfo;

  const { name } = eMgr.getCmpt(NameCmpt, townId);
  const townLocationsCmpt = eMgr.getCmpt(TownLocationsCmpt, townId);
  const locationIds = townLocationsCmpt.getChildren();
  return { townId, name, locationIds };
};

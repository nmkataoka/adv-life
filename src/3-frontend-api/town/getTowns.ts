import { TownLocationsCmpt } from '1-game-code/Town';
import { GameManager } from '0-engine/GameManager';
import { DictOf } from '8-helpers/DictOf';
import { TownInfo } from './TownInfo';
import { getNameCmpt } from '../getName';

const getLocations = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const townLocationCmpt = eMgr.getCmptMut(TownLocationsCmpt, entityHandle);
  return townLocationCmpt.getChildren();
};

export const getTowns = (): DictOf<TownInfo> => {
  const { eMgr } = GameManager.instance;
  const towns: DictOf<TownInfo> = {};
  const townView = eMgr.getView([TownLocationsCmpt], [], []);

  for (let i = 0; i < townView.count; ++i) {
    const e = townView.at(i);
    const entityHandle = parseInt(e, 10);

    const { name } = getNameCmpt(entityHandle);

    towns[entityHandle] = {
      townId: entityHandle,
      locationIds: getLocations(entityHandle),
      name,
    };
  }

  return towns;
};

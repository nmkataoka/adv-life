import { TownLocationsCmpt } from '1-game-code/Town';
import { GameManager } from '0-engine/GameManager';
import { DictOf } from '8-helpers/DictOf';
import { TownInfo } from './TownInfo';
import { getName } from '../name/getName';

/** @deprecated This should be updated to selectors */
const getLocations = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const townLocationCmpt = eMgr.getCmptMut(TownLocationsCmpt, entityHandle);
  return townLocationCmpt.getChildren();
};

/** @deprecated This should be updated to selectors where possible */
export const getTowns = (): DictOf<TownInfo> => {
  const { eMgr } = GameManager.instance;
  const towns: DictOf<TownInfo> = {};
  const townView = eMgr.getView([TownLocationsCmpt], [], []);

  for (let i = 0; i < townView.count; ++i) {
    const e = townView.at(i);

    const { name } = getName(e)(eMgr);

    towns[e] = {
      townId: e,
      locationIds: getLocations(e),
      name,
    };
  }

  return towns;
};

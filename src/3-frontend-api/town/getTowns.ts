import { GetView } from '../../0-engine';
import { TownLocationsCmpt } from '../../1-game-code/Town';
import { TownsDict } from './TownInfo';
import { GameManager } from '../../0-engine/GameManager';
import { getNameCmpt } from '../getName';

const getLocations = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const townLocationCmpt = eMgr.GetComponent(TownLocationsCmpt, entityHandle);
  return townLocationCmpt.getChildren();
};

export const getTowns = (): TownsDict => {
  const { eMgr } = GameManager.instance;
  const towns: TownsDict = {};
  const townView = GetView(eMgr, 0, TownLocationsCmpt);

  for (let i = 0; i < townView.Count; ++i) {
    const e = townView.At(i);
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

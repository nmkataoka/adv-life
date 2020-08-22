import { GetView } from '../../0-engine/ECS/View';
import { TownLocationsCmpt } from '../../1-ncomponents';
import { TownsDict } from './TownInfo';
import { GameManager } from '../../0-engine/GameManager';
import { getNameCmpt } from '../getName';

const getLocations = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const townLocationCmpt = eMgr.GetComponent(TownLocationsCmpt, entityHandle);
  return townLocationCmpt.getChildren();
};

export const getTowns = (): TownsDict => {
  const towns: TownsDict = {};
  const townView = GetView(0, TownLocationsCmpt);

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

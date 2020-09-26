import { EntityManager, NameCmpt } from '0-engine';
import { TownLocationsCmpt } from '1-game-code/Town';
import { DeepReadonly } from 'ts-essentials';
import { TownInfo } from './TownInfo';

export const getAllTowns = (eMgr: EntityManager): DeepReadonly<TownInfo[]> => {
  const view = eMgr.getView<[TownLocationsCmpt, NameCmpt]>([TownLocationsCmpt, NameCmpt]);
  const towns: TownInfo[] = [];
  view.forEach((e, [, nameCmpt]) => {
    towns.push({
      townId: e,
      name: nameCmpt.name,
      locationIds: [],
    });
  });
  return towns;
};

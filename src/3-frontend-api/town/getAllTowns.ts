import { EntityManager, NameCmpt } from '0-engine';
import { TownLocationsCmpt } from '1-game-code/Town';
import { Selector } from '4-react-ecsal';
import { TownInfo } from './TownInfo';

export const getAllTowns: Selector<TownInfo[]> = (eMgr: EntityManager) => {
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

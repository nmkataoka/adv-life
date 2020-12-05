import { EntityManager, NameCmpt } from '0-engine';
import { ComponentClasses } from '0-engine/ECS/component-dependencies/ComponentDependencies';
import { TownLocationsCmpt } from '1-game-code/Town';
import { Selector } from '4-react-ecsal';
import { TownInfo } from './TownInfo';

export const getAllTowns: Selector<TownInfo[]> = (eMgr: EntityManager) => {
  const view = eMgr.getView(new ComponentClasses({ readCmpts: [TownLocationsCmpt, NameCmpt] }));
  const towns: TownInfo[] = [];
  view.forEach((e, { readCmpts: [, nameCmpt] }) => {
    towns.push({
      townId: e,
      name: nameCmpt.name,
      locationIds: [],
    });
  });
  return towns;
};

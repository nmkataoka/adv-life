import { Entity, NameCmpt } from '0-engine';
import { InventoryCmpt } from '1-game-code/Inventory';
import { componentNode, selectorNode, Node, SelectorNode, viewNode } from '4-react-ecsal';
import { TownLocationsCmpt } from '1-game-code/Town';
import { ComponentClasses } from '0-engine/ECS/component-dependencies/ComponentDependencies';
import { TownLocationInfo } from './TownLocationInfo';

import { getName } from '../name';
import { defaultTownInfo, TownInfo } from './TownInfo';

export type { TownInfo } from './TownInfo';
export type { TownLocationInfo } from './TownLocationInfo';
export { getTowns } from './getTowns';

export const getTown = (townId: number): SelectorNode<TownInfo> =>
  selectorNode({
    get: ({ get }) => {
      if (townId < 0) return defaultTownInfo;
      const [{ name } = { name: 'Unnamed' }] = get(componentNode(NameCmpt, townId));
      const [townLocationsCmpt] = get(componentNode(TownLocationsCmpt, townId));
      const locationIds = townLocationsCmpt?.getChildren() ?? [];
      return { townId, name, locationIds };
    },
  });

export const getTownLocation = (townLocationId: Entity): Node<TownLocationInfo> =>
  selectorNode({
    get: ({ get }) => {
      const [{ name } = { name: 'Unnamed' }] = get(getName(townLocationId));
      const [inventory] = get(componentNode(InventoryCmpt, townLocationId));
      return {
        inventory,
        name,
        townLocationId,
      } as TownLocationInfo;
    },
  });

const getAllTownsView = viewNode(
  new ComponentClasses({ readCmpts: [TownLocationsCmpt, NameCmpt] }),
);

export const getAllTowns = selectorNode({
  get: ({ get }) => {
    const [allTownsView] = get(getAllTownsView);
    if (!allTownsView) return [];
    const towns: TownInfo[] = [];
    allTownsView.forEach((e, { readCmpts: [, nameCmpt] }) => {
      towns.push({
        townId: e,
        name: nameCmpt.name,
        locationIds: [],
      });
    });
    return towns;
  },
});

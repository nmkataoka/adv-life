import { Entity, NameCmpt } from '0-engine';
import { InventoryCmpt } from '1-game-code/Inventory';
import { componentNode, selectorNode, viewNode, selectorNodeFamily } from '4-react-ecsal';
import { TownLocationsCmpt } from '1-game-code/Town';
import { ComponentClasses } from '0-engine/ECS/component-dependencies/ComponentDependencies';
import { TownCmpt } from '1-game-code/Town/TownCmpt';
import { TownLocationInfo } from './TownLocationInfo';

import { getName } from '../name';
import { defaultTownInfo, TownInfo } from './TownInfo';

export type { TownInfo } from './TownInfo';
export type { TownLocationInfo } from './TownLocationInfo';

export const getTown = selectorNodeFamily({
  get: (townId: Entity) => ({ get }) => {
    if (townId < 0) return defaultTownInfo;
    const [{ name } = { name: 'Unnamed' }] = get(componentNode(NameCmpt, townId));
    const [townLocationsCmpt] = get(componentNode(TownLocationsCmpt, townId));
    const locationIds = townLocationsCmpt?.getChildren() ?? [];
    return { townId, name, locationIds };
  },
  computeKey: (townId: Entity) => `${townId}`,
});

export const getTownLocation = selectorNodeFamily({
  get: (townLocationId: Entity) => ({ get }) => {
    const [{ name } = { name: 'Unnamed' }] = get(getName(townLocationId));
    const [inventory] = get(componentNode(InventoryCmpt, townLocationId));
    return {
      inventory,
      name,
      townLocationId,
    } as TownLocationInfo;
  },
  computeKey: (townLocationId: Entity) => `${townLocationId}`,
});

const getAllTownsView = viewNode(
  new ComponentClasses({ readCmpts: [TownLocationsCmpt, NameCmpt, TownCmpt] }),
);

export const getAllTowns = selectorNode({
  get: ({ get }) => {
    // Note: views currently have no mutation detection optimizations so this is rerun every tick
    const [allTownsView] = get(getAllTownsView);
    if (!allTownsView) return [];
    const towns: TownInfo[] = [];
    allTownsView.forEach((e, { readCmpts: [townLocationsCmpt, nameCmpt, townCmpt] }) => {
      const { locationIds } = townLocationsCmpt;
      const { coords } = townCmpt;
      towns.push({
        townId: e,
        name: nameCmpt.name,
        locationIds,
        coords,
      });
    });
    return towns;
  },
});

import { NULL_ENTITY } from '0-engine';
import { ComponentClasses } from '0-engine/ECS/component-dependencies/ComponentDependencies';
import { InventoryCmpt, PlayerCmpt } from '1-game-code/ncomponents';
import { UnitLocationCmpt } from '1-game-code/Unit/UnitLocationCmpt';
import { componentNode, selectorNode, viewNode } from '4-react-ecsal';

const playerView = viewNode(new ComponentClasses({ readCmpts: [PlayerCmpt] }));

export const getPlayerId = selectorNode({
  get: ({ get }) => {
    const [view] = get(playerView);
    const player = view?.at(0);
    return player;
  },
});

export const getPlayerInventory = selectorNode({
  get: ({ get }) => {
    const [playerEntityId = NULL_ENTITY] = get(getPlayerId);
    const inventoryNode = componentNode(InventoryCmpt, playerEntityId);
    const inventory = get(inventoryNode);
    return inventory[0];
  },
});

export const getPlayerCurrentTown = selectorNode({
  get: ({ get }) => {
    const [playerEntityId = NULL_ENTITY] = get(getPlayerId);
    const unitLocationNode = componentNode(UnitLocationCmpt, playerEntityId);
    const [unitLocationCmpt] = get(unitLocationNode);
    return unitLocationCmpt?.townId;
  },
});

import { ComponentClasses } from '0-engine/ECS/component-dependencies/ComponentDependencies';
import { InventoryCmpt, PlayerCmpt } from '1-game-code/ncomponents';
import { componentNode, selectorNode, viewNode } from '4-react-ecsal';

const playerView = viewNode(new ComponentClasses({ readCmpts: [PlayerCmpt] }));

export const playerId = selectorNode({
  get: ({ get }) => {
    const [view] = get(playerView);
    const player = view?.at(0);
    return player;
  },
});

export const getPlayerInventory = selectorNode({
  get: ({ get }) => {
    const [playerEntityId = -1] = get(playerId);
    const inventoryNode = componentNode(InventoryCmpt, playerEntityId);
    const inventory = get(inventoryNode);
    return inventory[0];
  },
});

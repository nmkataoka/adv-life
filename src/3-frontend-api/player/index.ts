import { Entity, NULL_ENTITY } from '0-engine';
import { ComponentClasses } from '0-engine/ECS/component-dependencies/ComponentDependencies';
import { InventoryCmpt, PlayerCmpt } from '1-game-code/ncomponents';
import { UnitLocationCmpt } from '1-game-code/Unit/UnitLocationCmpt';
import { civView } from '3-frontend-api/civ';
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

export const getPlayerCiv = selectorNode({
  get: ({ get }) => {
    const [view] = get(civView);
    const [playerId] = get(getPlayerId);
    if (playerId === NULL_ENTITY) {
      throw new Error('Tried to get player civ but no player exists.');
    }

    let ownedCivId: Entity = NULL_ENTITY;
    view?.forEach((civId, { readCmpts: [civCmpt] }) => {
      if (civCmpt.admin === playerId) {
        ownedCivId = civId;
      }
    });
    return ownedCivId;
  },
});

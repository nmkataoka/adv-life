import { GameManager } from '../../0-engine/GameManager';
import { InventoryCmpt } from '../../1-game-code/ncomponents';
import { InventoryInfo } from './InventoryInfo';

export const getInventoryInfo = (entityHandle: number): InventoryInfo => {
  const { eMgr } = GameManager.instance;
  const inventoryCmpt = eMgr.GetComponent(InventoryCmpt, entityHandle);
  const { itemStacks, gold } = inventoryCmpt;

  return {
    itemStacks: itemStacks.map(({ itemIds, publicSalePrice }) => ({
      itemIds: itemIds.map((itemEntity) => itemEntity.handle),
      publicSalePrice,
    })),
    gold,
  };
};

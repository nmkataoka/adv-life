import { GameManager } from '../../0-engine/GameManager';
import { InventoryCmpt } from '../../1-game-code/ncomponents';
import { InventoryInfo } from './InventoryInfo';

export const getInventoryInfo = (entityHandle: number): InventoryInfo => {
  const { eMgr } = GameManager.instance;
  const inventoryCmpt = eMgr.GetComponent(InventoryCmpt, entityHandle);
  const { inventorySlots, gold } = inventoryCmpt;

  return {
    inventorySlots: inventorySlots.map(({ itemId, publicSalePrice }) => ({
      name: 'unknown',
      itemId: itemId.handle,
      publicSalePrice,
      itemType: '',
    })),
    gold,
  };
};

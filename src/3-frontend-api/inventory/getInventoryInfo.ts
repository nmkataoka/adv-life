import { GameManager } from '../../0-engine/GameManager';
import { InventoryCmpt, NameCmpt } from '../../1-game-code/ncomponents';
import { InventoryInfo } from './InventoryInfo';

export const getInventoryInfo = (entityHandle: number): InventoryInfo => {
  const { eMgr } = GameManager.instance;
  const nameManager = eMgr.GetComponentManager(NameCmpt);
  const inventoryCmpt = eMgr.GetComponent(InventoryCmpt, entityHandle);
  const { inventorySlots, gold } = inventoryCmpt;
  const items = inventorySlots.map(({ itemId, publicSalePrice }) => ({
    itemId: itemId.handle,
    name: nameManager.Get(itemId)?.name || '',
    publicSalePrice,
    itemType: '',
  }));

  return {
    inventorySlots: items,
    gold,
  };
};

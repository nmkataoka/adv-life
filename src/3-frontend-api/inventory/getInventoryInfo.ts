import { GameManager } from '../../0-engine/GameManager';
import { InventoryCmpt, NameCmpt } from '../../1-game-code/ncomponents';
import { InventorySlot } from '../../1-game-code/ncomponents/InventoryCmpt';
import { InventoryInfo } from './InventoryInfo';

export const getInventoryInfo = (entityHandle: number): InventoryInfo => {
  if (entityHandle < 0) {
    return { inventorySlots: [], gold: 0 };
  }

  const { eMgr } = GameManager.instance;
  const nameManager = eMgr.GetComponentManager(NameCmpt);
  const inventoryCmpt = eMgr.GetComponent(InventoryCmpt, entityHandle);
  const { inventorySlots, gold } = inventoryCmpt;
  const inventorySlotsNotNull = inventorySlots.filter((slot) => slot != null) as InventorySlot[];
  const items = inventorySlotsNotNull.map(({ itemId, publicSalePrice }) => ({
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

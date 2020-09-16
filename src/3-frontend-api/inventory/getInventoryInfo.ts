import { GameManager } from '../../0-engine/GameManager';
import { InventoryCmpt, NameCmpt } from '../../1-game-code/ncomponents';
import { InventoryInfo, InventorySlotInfo } from './InventoryInfo';

const emptyInventorySlot: InventorySlotInfo = {
  itemId: -1,
  name: '',
  publicSalePrice: 0,
  itemType: '',
};

export const getInventoryInfo = (entityHandle: number): InventoryInfo => {
  if (entityHandle < 0) {
    return { inventorySlots: [], gold: 0 };
  }

  const { eMgr } = GameManager.instance;
  const nameManager = eMgr.GetComponentManager(NameCmpt);
  const inventoryCmpt = eMgr.GetComponent(InventoryCmpt, entityHandle);
  const { inventorySlots, gold } = inventoryCmpt;
  const items: InventorySlotInfo[] = inventorySlots.map((slot) => {
    if (slot == null) {
      return { ...emptyInventorySlot };
    }
    const { itemId, publicSalePrice } = slot;
    return {
      publicSalePrice,
      itemId: itemId.handle,
      itemType: '',
      name: nameManager.Get(itemId)?.name || '',
    };
  });

  return {
    inventorySlots: items,
    gold,
  };
};

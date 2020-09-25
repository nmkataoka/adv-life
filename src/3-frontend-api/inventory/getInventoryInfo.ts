import { GameManager } from '0-engine/GameManager';
import { InventoryCmpt } from '1-game-code/ncomponents';
import { defaultInventorySlotInfo, InventoryInfo, InventorySlotInfo } from './InventoryInfo';

const emptyInventorySlot = { ...defaultInventorySlotInfo };

export const getInventoryInfo = (entityHandle: number): InventoryInfo => {
  if (entityHandle < 0) {
    return { inventorySlots: [], gold: 0 };
  }

  const { eMgr } = GameManager.instance;
  const inventoryCmpt = eMgr.getCmptMut(InventoryCmpt, entityHandle);
  const { inventorySlots, gold } = inventoryCmpt;
  const items: InventorySlotInfo[] = inventorySlots.map((slot) => {
    if (slot == null) {
      return { ...emptyInventorySlot };
    }
    const { health, itemClassId, materialId, publicSalePrice, stackCount } = slot;
    return {
      health,
      itemClassId,
      materialId,
      publicSalePrice,
      stackCount,
    };
  });

  return {
    inventorySlots: items,
    gold,
  };
};

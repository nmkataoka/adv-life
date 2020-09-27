import { EntityManager } from '0-engine';
import { InventoryCmpt } from '1-game-code/Inventory';
import { Selector } from '4-react-ecsal';
import { defaultInventorySlotInfo, InventoryInfo } from './InventoryInfo';

export const getInventory = (e: number | string): Selector<InventoryInfo> => (
  eMgr: EntityManager,
) => {
  const { gold = 0, inventorySlots = [] } = eMgr.tryGetCmpt(InventoryCmpt, e) ?? {};
  return {
    gold,
    inventorySlots: inventorySlots.map((slot) => {
      if (!slot) {
        return { ...defaultInventorySlotInfo };
      }
      const { health, itemClassId, materialId, publicSalePrice, stackCount } = slot;
      return {
        health,
        itemClassId,
        materialId,
        publicSalePrice,
        stackCount,
      };
    }),
  };
};

import { createEventSlice } from '0-engine';
import { EventCallbackError } from '0-engine/ECS/event-system';
import { InventoryCmpt } from '../ncomponents';

const buyItemFromMerchantSlice = createEventSlice('buyItemFromMerchant', {
  writeCmpts: [InventoryCmpt],
})<{
  buyerId: number;
  itemIndex: number;
  sellerId: number;
}>(function buyItemFromMerchant({
  componentManagers: {
    writeCMgrs: [inventoryMgr],
  },
  payload: { buyerId, itemIndex, sellerId },
}) {
  const buyerInventoryCmpt = inventoryMgr.getMut(buyerId);
  const sellerInventoryCmpt = inventoryMgr.getMut(sellerId);
  const item = sellerInventoryCmpt.getAt(itemIndex);

  if (item != null) {
    const { publicSalePrice } = item;
    if (buyerInventoryCmpt.gold < publicSalePrice) {
      throw new EventCallbackError('Not enough gold');
      return;
    }

    const itemIdxInBuyerInventory = buyerInventoryCmpt.addItemToNextEmptySlot(item);

    if (itemIdxInBuyerInventory < 0) {
      throw new EventCallbackError('Inventory is full!');
    }
    sellerInventoryCmpt.removeAt(itemIndex);
    buyerInventoryCmpt.gold -= publicSalePrice;
    sellerInventoryCmpt.gold += publicSalePrice;
  }
});

export const { buyItemFromMerchant } = buyItemFromMerchantSlice;

export default [buyItemFromMerchantSlice.eventListener];

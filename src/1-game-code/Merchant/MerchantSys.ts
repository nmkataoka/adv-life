import { ECSystem, EventCallbackArgs } from '0-engine';
import { EventCallbackError, EventSys } from '0-engine/ECS/event-system';
import { InventoryCmpt } from '../ncomponents';
import { BUY_ITEM_FROM_MERCHANT } from './constants';

const entityBuysItemFromMerchant = ({
  eMgr,
  payload: { buyerId, itemIndex, sellerId },
}: EventCallbackArgs<{ itemIndex: number; buyerId: number; sellerId: number }>) => {
  const inventoryCMgr = eMgr.tryGetMgrMut(InventoryCmpt);
  const buyerInventoryCmpt = inventoryCMgr.getMut(buyerId);
  const sellerInventoryCmpt = inventoryCMgr.getMut(sellerId);
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
};

export class MerchantSys extends ECSystem {
  public Start = (): void => {
    this.eMgr.getSys(EventSys).RegisterListener(BUY_ITEM_FROM_MERCHANT, entityBuysItemFromMerchant);
  };

  public OnUpdate = (): void => {};
}

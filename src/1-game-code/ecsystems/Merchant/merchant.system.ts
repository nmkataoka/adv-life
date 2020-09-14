import { ECSystem, EventCallbackArgs } from '../../../0-engine';
import { EventSys } from '../../../0-engine/ECS/event-system';
import { InventoryCmpt } from '../../ncomponents';
import { BUY_ITEM_FROM_MERCHANT } from './constants';

const entityBuysItemFromMerchant = ({
  eMgr,
  payload: { buyerId, itemId, sellerId },
  ack,
}: EventCallbackArgs<{ itemId: number; buyerId: number; sellerId: number }>) => {
  const inventoryCMgr = eMgr.GetComponentManager(InventoryCmpt);
  const buyerInventoryCmpt = inventoryCMgr.GetByNumber(buyerId);
  const sellerInventoryCmpt = inventoryCMgr.GetByNumber(sellerId);
  const itemData = sellerInventoryCmpt.findItemById(itemId);

  if (itemData != null) {
    const { publicSalePrice } = itemData;
    if (buyerInventoryCmpt.gold < publicSalePrice) {
      ack({ error: 'Not enough gold' });
      return;
    }

    const itemIdxInBuyerInventory = buyerInventoryCmpt.addItemToNextEmptySlot(itemData);

    if (itemIdxInBuyerInventory > -1) {
      sellerInventoryCmpt.removeItemById(itemData.itemId.handle);
      buyerInventoryCmpt.gold -= publicSalePrice;
      sellerInventoryCmpt.gold += publicSalePrice;
    } else if (ack) {
      ack({ error: 'Inventory is full!' });
    }
  }
};

export class MerchantSys extends ECSystem {
  public Start = (): void => {
    this.eMgr.GetSystem(EventSys).RegisterListener(BUY_ITEM_FROM_MERCHANT, entityBuysItemFromMerchant);
  };

  public OnUpdate = (): void => {};
}

import { ECSystem, EventCallbackArgs } from '../../0-engine';
import { EventSys } from '../../0-engine/ECS/event-system';
import { InventoryCmpt } from '../ncomponents';
import { BUY_ITEM_FROM_MERCHANT } from './constants';

const entityBuysItemFromMerchant = ({
  eMgr,
  payload: { buyerId, itemIndex, sellerId },
  ack,
}: EventCallbackArgs<{ itemIndex: number; buyerId: number; sellerId: number }>) => {
  const inventoryCMgr = eMgr.GetComponentManager(InventoryCmpt);
  const buyerInventoryCmpt = inventoryCMgr.GetByNumber(buyerId);
  const sellerInventoryCmpt = inventoryCMgr.GetByNumber(sellerId);
  const item = sellerInventoryCmpt.getAt(itemIndex);

  if (item != null) {
    const { publicSalePrice } = item;
    if (buyerInventoryCmpt.gold < publicSalePrice) {
      ack({ status: 400, error: 'Not enough gold' });
      return;
    }

    const itemIdxInBuyerInventory = buyerInventoryCmpt.addItemToNextEmptySlot(item);

    if (itemIdxInBuyerInventory > -1) {
      sellerInventoryCmpt.removeAt(itemIndex);
      buyerInventoryCmpt.gold -= publicSalePrice;
      sellerInventoryCmpt.gold += publicSalePrice;
      ack({ status: 200 });
    } else if (ack) {
      ack({ status: 400, error: 'Inventory is full!' });
    }
  }
};

export class MerchantSys extends ECSystem {
  public Start = (): void => {
    this.eMgr
      .GetSystem(EventSys)
      .RegisterListener(BUY_ITEM_FROM_MERCHANT, entityBuysItemFromMerchant);
  };

  public OnUpdate = (): void => {};
}

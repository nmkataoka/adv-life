import { ECSystem, EventCallbackArgs } from '../../../0-engine';
import { EventSys } from '../../../0-engine/ECS/event-system';
import { InventoryCmpt } from '../../ncomponents';
import { BUY_ITEM_FROM_MERCHANT } from './constants';

const entityBuysItemFromMerchant = ({
  eMgr,
  payload: { buyerInventoryId, itemId, sellerInventoryId },
  ack,
}: EventCallbackArgs<{ itemId: number; buyerInventoryId: number; sellerInventoryId: number }>) => {
  const inventoryCMgr = eMgr.GetComponentManager(InventoryCmpt);
  const buyerInventoryCmpt = inventoryCMgr.GetByNumber(buyerInventoryId);
  const sellerInventoryCmpt = inventoryCMgr.GetByNumber(sellerInventoryId);
  const itemData = sellerInventoryCmpt.findItemById(itemId);

  if (itemData != null) {
    const itemIdxInBuyerInventory = buyerInventoryCmpt.addItemToNextEmptySlot(itemData);

    if (itemIdxInBuyerInventory > -1) {
      sellerInventoryCmpt.removeItemById(itemData.itemId.handle);
    } else if (ack) {
      ack({ error: 'Inventory is full!' });
    }
  }
};

export class MerchantSys extends ECSystem {
  public Start(): void {
    this.eMgr.GetSystem(EventSys).RegisterListener(BUY_ITEM_FROM_MERCHANT, entityBuysItemFromMerchant);
  }

  public OnUpdate(): void {}
}

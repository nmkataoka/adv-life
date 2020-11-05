import { ECSystem, EventCallbackArgs, EventCallbackError, EventSys } from '0-engine';
import { HOLD_ITEM_FROM_INVENTORY, WEAR_ITEM_FROM_INVENTORY } from './Constants';
import { HeldItemsCmpt } from './HeldItemsCmpt';
import { InventoryCmpt } from './InventoryCmpt';
import { WornItemsCmpt } from './WornItemsCmpt';

const holdItemFromInventory = ({
  eMgr,
  payload: { agentId, itemIndex },
}: EventCallbackArgs<{ agentId: number; itemIndex: number }>) => {
  const inventoryCmpt = eMgr.tryGetCmptMut(InventoryCmpt, agentId);
  const heldItemsCmpt = eMgr.tryGetCmptMut(HeldItemsCmpt, agentId);

  if (!inventoryCmpt || !heldItemsCmpt) {
    throw new EventCallbackError('Missing inventoryCmpt or heldItemsCmpt');
  }

  const item = inventoryCmpt.getAt(itemIndex);
  if (!item) {
    throw new EventCallbackError('Missing item in inventory');
  }

  heldItemsCmpt.items.push(item);
  inventoryCmpt.removeAt(itemIndex);
};

const wearItemFromInventory = ({
  eMgr,
  payload: { agentId, itemIndex },
}: EventCallbackArgs<{ agentId: number; itemIndex: number }>) => {
  const inventoryCmpt = eMgr.tryGetCmptMut(InventoryCmpt, agentId);
  const wornItemsCmpt = eMgr.tryGetCmptMut(WornItemsCmpt, agentId);

  if (!inventoryCmpt || !wornItemsCmpt) {
    throw new EventCallbackError('Missing inventoryCmpt or wornItemsCmpt');
  }

  const item = inventoryCmpt.getAt(itemIndex);
  if (!item) {
    throw new EventCallbackError('Missing item in inventory');
  }

  wornItemsCmpt.items.push(item);
  inventoryCmpt.removeAt(itemIndex);
};

export class EquipmentSys extends ECSystem {
  public Start = (): void => {
    const eventSys = this.eMgr.getSys(EventSys);
    eventSys.RegisterListener(HOLD_ITEM_FROM_INVENTORY, holdItemFromInventory);
    eventSys.RegisterListener(WEAR_ITEM_FROM_INVENTORY, wearItemFromInventory);
  };

  public OnUpdate = (): void => {};
}

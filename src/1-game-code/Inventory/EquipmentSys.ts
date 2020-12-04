import { createEventListener, ECSystem, EventCallbackError, EventSys } from '0-engine';
import { HOLD_ITEM_FROM_INVENTORY, WEAR_ITEM_FROM_INVENTORY } from './Constants';
import { HeldItemsCmpt } from './HeldItemsCmpt';
import { InventoryCmpt } from './InventoryCmpt';
import { WornItemsCmpt } from './WornItemsCmpt';

const holdItemFromInventorySlice = createEventListener({
  writeCmpts: [HeldItemsCmpt, InventoryCmpt],
})<{
  agentId: number;
  itemIndex: number;
}>(function holdItemFromInventory({
  componentManagers: {
    writeCMgrs: [heldItemsMgr, inventoryMgr],
  },
  payload: { agentId, itemIndex },
}) {
  const inventoryCmpt = inventoryMgr.tryGetMut(agentId);
  const heldItemsCmpt = heldItemsMgr.tryGetMut(agentId);

  if (!inventoryCmpt || !heldItemsCmpt) {
    throw new EventCallbackError('Missing inventoryCmpt or heldItemsCmpt');
  }

  const item = inventoryCmpt.getAt(itemIndex);
  if (!item) {
    throw new EventCallbackError('Missing item in inventory');
  }

  heldItemsCmpt.items.push(item);
  inventoryCmpt.removeAt(itemIndex);
});

const wearItemFromInventorySlice = createEventListener({
  writeCmpts: [InventoryCmpt, WornItemsCmpt],
})<{
  agentId: number;
  itemIndex: number;
}>(function wearItemFromInventory({
  componentManagers: {
    writeCMgrs: [inventoryMgr, wornItemsMgr],
  },
  payload: { agentId, itemIndex },
}) {
  const inventoryCmpt = inventoryMgr.tryGetMut(agentId);
  const wornItemsCmpt = wornItemsMgr.tryGetMut(agentId);

  if (!inventoryCmpt || !wornItemsCmpt) {
    throw new EventCallbackError('Missing inventoryCmpt or wornItemsCmpt');
  }

  const item = inventoryCmpt.getAt(itemIndex);
  if (!item) {
    throw new EventCallbackError('Missing item in inventory');
  }

  wornItemsCmpt.items.push(item);
  inventoryCmpt.removeAt(itemIndex);
});

export class EquipmentSys extends ECSystem {
  public Start = (): void => {
    const eventSys = this.eMgr.getSys(EventSys);
    eventSys.RegisterListener(HOLD_ITEM_FROM_INVENTORY, holdItemFromInventorySlice.eventListener);
    eventSys.RegisterListener(WEAR_ITEM_FROM_INVENTORY, wearItemFromInventorySlice.eventListener);
  };

  public OnUpdate = (): void => {};
}

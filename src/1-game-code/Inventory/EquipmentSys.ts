import { createEventSlice, EventCallbackError } from '0-engine';
import { HeldItemsCmpt } from './HeldItemsCmpt';
import { InventoryCmpt } from './InventoryCmpt';
import { WornItemsCmpt } from './WornItemsCmpt';

const holdItemFromInventorySlice = createEventSlice('holdItemFromInventory', {
  writeCmpts: [HeldItemsCmpt, InventoryCmpt],
})<{
  agentId: number;
  itemIndex: number;
}>(
  ({
    componentManagers: {
      writeCMgrs: [heldItemsMgr, inventoryMgr],
    },
    payload: { agentId, itemIndex },
  }) => {
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
  },
);

const wearItemFromInventorySlice = createEventSlice('wearItemFromInventory', {
  writeCmpts: [InventoryCmpt, WornItemsCmpt],
})<{
  agentId: number;
  itemIndex: number;
}>(
  ({
    componentManagers: {
      writeCMgrs: [inventoryMgr, wornItemsMgr],
    },
    payload: { agentId, itemIndex },
  }) => {
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
  },
);

export const { holdItemFromInventory } = holdItemFromInventorySlice;
export const { wearItemFromInventory } = wearItemFromInventorySlice;

export default [holdItemFromInventorySlice.eventListener, wearItemFromInventorySlice.eventListener];

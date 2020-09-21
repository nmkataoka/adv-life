import { ECSystem, EventCallbackArgs, EventSys } from '0-engine';
import { HOLD_ITEM_FROM_INVENTORY, WEAR_ITEM_FROM_INVENTORY } from './Constants';
import { HeldItemsCmpt } from './HeldItemsCmpt';
import { InventoryCmpt } from './InventoryCmpt';
import { WornItemsCmpt } from './WornItemsCmpt';

const holdItemFromInventory = ({
  eMgr,
  payload: { agentId, itemIndex },
  ack,
}: EventCallbackArgs<{ agentId: number; itemIndex: number }>) => {
  const inventoryCmpt = eMgr.GetComponentUncertain(InventoryCmpt, agentId);
  const heldItemsCmpt = eMgr.GetComponentUncertain(HeldItemsCmpt, agentId);

  if (!inventoryCmpt || !heldItemsCmpt) {
    ack({ error: 'Missing inventoryCmpt or heldItemsCmpt', status: 400 });
    return;
  }

  const item = inventoryCmpt.getAt(itemIndex);
  if (!item) {
    ack({ status: 404, error: 'Missing item in inventory' });
    return;
  }

  heldItemsCmpt.items.push(item);
  inventoryCmpt.removeAt(itemIndex);
};

const wearItemFromInventory = ({
  eMgr,
  payload: { agentId, itemIndex },
  ack,
}: EventCallbackArgs<{ agentId: number; itemIndex: number }>) => {
  const inventoryCmpt = eMgr.GetComponentUncertain(InventoryCmpt, agentId);
  const wornItemsCmpt = eMgr.GetComponentUncertain(WornItemsCmpt, agentId);

  if (!inventoryCmpt || !wornItemsCmpt) {
    ack({ error: 'Missing inventoryCmpt or wornItemsCmpt', status: 400 });
    return;
  }

  const item = inventoryCmpt.getAt(itemIndex);
  if (!item) {
    ack({ status: 404, error: 'Missing item in inventory' });
    return;
  }

  wornItemsCmpt.items.push(item);
  inventoryCmpt.removeAt(itemIndex);
};

export class EquipmentSys extends ECSystem {
  public Start = (): void => {
    const eventSys = this.eMgr.GetSystem(EventSys);
    eventSys.RegisterListener(HOLD_ITEM_FROM_INVENTORY, holdItemFromInventory);
    eventSys.RegisterListener(WEAR_ITEM_FROM_INVENTORY, wearItemFromInventory);
  };

  public OnUpdate = (): void => {};
}

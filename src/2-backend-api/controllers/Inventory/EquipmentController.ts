import { Controller, RequestData, Router } from '0-engine';
import { EventSys } from '0-engine/ECS/event-system';
import { holdItemFromInventory, wearItemFromInventory } from '1-game-code/Inventory/EquipmentSys';
import { HOLD_ITEM_FROM_INVENTORY, WEAR_ITEM_FROM_INVENTORY } from './Constants';

const holdItem = async (
  { headers: { userId }, payload }: RequestData<{ itemIndex: number }>,
  dispatch: typeof EventSys.prototype.Dispatch,
): Promise<void> => {
  await dispatch(holdItemFromInventory({ ...payload, agentId: userId }));
};

const wearItem = async (
  { headers: { userId }, payload }: RequestData<{ itemIndex: number }>,
  dispatch: typeof EventSys.prototype.Dispatch,
): Promise<void> => {
  await dispatch(wearItemFromInventory({ ...payload, agentId: userId }));
};

export class EquipmentController extends Controller {
  public Start = (router: Router): void => {
    router.addRoute(HOLD_ITEM_FROM_INVENTORY, holdItem);
    router.addRoute(WEAR_ITEM_FROM_INVENTORY, wearItem);
  };

  public OnUpdate = (): void => {};
}

import { Controller, EventSys, RequestData, Router } from '0-engine';
import {
  HOLD_ITEM_FROM_INVENTORY as HOLD_ITEM_FROM_INVENTORY_ENGINE,
  WEAR_ITEM_FROM_INVENTORY,
  WEAR_ITEM_FROM_INVENTORY as WEAR_ITEM_FROM_INVENTORY_ENGINE,
} from '1-game-code/Inventory/Constants';
import { HOLD_ITEM_FROM_INVENTORY } from './Constants';

const holdItem = async (
  { headers: { userId }, payload }: RequestData<{ itemIndex: number }>,
  dispatch: typeof EventSys.prototype.Dispatch,
): Promise<void> => {
  await dispatch({
    type: HOLD_ITEM_FROM_INVENTORY_ENGINE,
    payload: { ...payload, agentId: userId },
  });
};

const wearItem = async (
  { headers: { userId }, payload }: RequestData<{ itemIndex: number }>,
  dispatch: typeof EventSys.prototype.Dispatch,
): Promise<void> => {
  await dispatch({
    type: WEAR_ITEM_FROM_INVENTORY_ENGINE,
    payload: { ...payload, agentId: userId },
  });
};

export class EquipmentController extends Controller {
  public Start = (router: Router): void => {
    router.addRoute(HOLD_ITEM_FROM_INVENTORY, holdItem);
    router.addRoute(WEAR_ITEM_FROM_INVENTORY, wearItem);
  };

  public OnUpdate = (): void => {};
}

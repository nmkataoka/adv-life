import { Controller, EventSys, RequestData, Router } from '../../../0-engine';
import {
  HOLD_ITEM_FROM_INVENTORY as HOLD_ITEM_FROM_INVENTORY_ENGINE,
  WEAR_ITEM_FROM_INVENTORY,
  WEAR_ITEM_FROM_INVENTORY as WEAR_ITEM_FROM_INVENTORY_ENGINE,
} from '../../../1-game-code/ecsystems/Inventory/Constants';
import { HOLD_ITEM_FROM_INVENTORY } from './Constants';

const holdItem = (
  { headers: { userId }, payload, ack }: RequestData<{ itemId: number }>,
  dispatch: typeof EventSys.prototype.Dispatch,
): void => {
  dispatch({
    type: HOLD_ITEM_FROM_INVENTORY_ENGINE,
    payload: { ...payload, agentId: userId },
    ack,
  });
};

const wearItem = (
  { headers: { userId }, payload, ack }: RequestData<{ itemId: number }>,
  dispatch: typeof EventSys.prototype.Dispatch,
): void => {
  dispatch({
    type: WEAR_ITEM_FROM_INVENTORY_ENGINE,
    payload: { ...payload, agentId: userId },
    ack,
  });
};

export class EquipmentController extends Controller {
  public Start = (router: Router): void => {
    router.addRoute(HOLD_ITEM_FROM_INVENTORY, holdItem);
    router.addRoute(WEAR_ITEM_FROM_INVENTORY, wearItem);
  };

  public OnUpdate = (): void => {};
}

import { Controller, RequestData, Router } from '0-engine';
import { BUY_ITEM_FROM_MERCHANT } from '1-game-code/Merchant/constants';
import { EventSys } from '0-engine/ECS/event-system';
import { BUY_ITEM } from './ShopConstants';

export class ShopController extends Controller {
  public Start = (router: Router): void => {
    router.addRoute(BUY_ITEM, this.OnBuyItem);
  };

  public OnUpdate = (): void => {};

  private OnBuyItem = async (
    { headers: { userId }, payload }: RequestData<{ itemIndex: number; sellerId: number }>,
    dispatch: typeof EventSys.prototype.Dispatch,
  ): Promise<void> => {
    await dispatch({ type: BUY_ITEM_FROM_MERCHANT, payload: { ...payload, buyerId: userId } });
  };
}

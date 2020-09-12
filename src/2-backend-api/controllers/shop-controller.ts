import { Controller, EventCallbackArgs } from '../../0-engine';
import { GetEventSys } from '../../0-engine/ECS/globals/DispatchEvent';
import { BUY_ITEM } from './shop.constants';

export class ShopController extends Controller {
  public Start(): void {
    const eventSys = GetEventSys();
    eventSys.RegisterListener(BUY_ITEM, this.OnBuyItem);
  }

  public OnUpdate(): void {}

  private OnBuyItem = ({ payload: { itemId }, ack }: EventCallbackArgs<{ itemId: number }>): void => {
    if (ack) {
      ack(undefined);
    }
  };
}

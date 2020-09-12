import { ECSystem, EventCallbackArgs } from '../../../0-engine';

const entityBuysItemFromMerchant = ({
  payload,
}: EventCallbackArgs<{ itemId: number; buyerInventoryId: number; sellerInventoryId: number }>) => {};

export class MerchantSys extends ECSystem {
  public Start(): void {}

  public OnUpdate(): void {}
}

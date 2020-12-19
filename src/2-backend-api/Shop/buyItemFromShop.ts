import { Thunk } from '0-engine';
import { entityBuysItemFromMerchant } from '1-game-code/Merchant/MerchantSys';
import apiClient from '3-frontend-api/ApiClient';

export const buyItemFromShop = (payload: { itemIndex: number; sellerId: number }): Thunk => (
  dispatch,
) => dispatch(entityBuysItemFromMerchant({ ...payload, buyerId: apiClient.headers.userId }));

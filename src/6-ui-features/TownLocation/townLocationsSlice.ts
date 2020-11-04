import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import deepEqual from 'fast-deep-equal';
import { BUY_ITEM } from '2-backend-api/controllers/ShopConstants';
import apiClient from '3-frontend-api/ApiClient';
import { TownLocationInfo } from '3-frontend-api/town';
import { DictOf } from '8-helpers/DictOf';
import { AppThunk } from '7-app/types';
import { playerBoughtItemFromShop } from '../Player/playerBoughtItemFromShop';

const initialState = {
  byId: {} as DictOf<TownLocationInfo>,
};

const townLocationsSlice = createSlice({
  name: 'townLocations',
  initialState,
  reducers: {
    updatedTownLocations(
      state,
      action: PayloadAction<{ byId: DictOf<TownLocationInfo>; allIds: number[] }>,
    ) {
      const { byId, allIds } = action.payload;
      allIds.forEach((townLocationId) => {
        if (!deepEqual(state.byId[townLocationId], byId[townLocationId])) {
          state.byId[townLocationId] = byId[townLocationId];
        }
      });
    },
  },
});

export default townLocationsSlice.reducer;

export const buyItemFromShop = ({
  itemIndex,
  sellerId,
  price,
}: {
  itemIndex: number;
  sellerId: number;
  price: number;
}): AppThunk => async (dispatch) => {
  try {
    await apiClient.emit(BUY_ITEM, { itemIndex, sellerId });
    dispatch(playerBoughtItemFromShop({ itemIndex, sellerId, price }));
  } catch {
    // do nothing
  }
};

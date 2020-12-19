import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import deepEqual from 'fast-deep-equal';
import { TownLocationInfo } from '3-frontend-api/town';
import { DictOf } from '8-helpers/DictOf';

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

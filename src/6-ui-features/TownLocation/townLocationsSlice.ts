import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import deepEqual from 'fast-deep-equal';
import { TownLocationsDict, getTownLocationInfo } from '../../3-frontend-api/town';
import { AppThunk } from '../../7-app/types';

const initialState = {
  byId: {} as TownLocationsDict,
};

const townLocationsSlice = createSlice({
  name: 'townLocations',
  initialState,
  reducers: {
    updatedTownLocations(state, action: PayloadAction<{byId: TownLocationsDict, allIds: number[]}>) {
      const { byId, allIds } = action.payload;
      allIds.forEach((townLocationId) => {
        if (!deepEqual(state.byId[townLocationId], byId[townLocationId])) {
          state.byId[townLocationId] = byId[townLocationId];
        }
      });
    },
  },
});

export const { updatedTownLocations } = townLocationsSlice.actions;

export default townLocationsSlice.reducer;

export const updateTownLocationsFromEngine = (townLocationIds: number[]): AppThunk => (dispatch) => {
  const townLocationInfos = townLocationIds.map((townLocationId) => getTownLocationInfo(townLocationId));
  const byId = townLocationInfos.reduce((dict, townLocation) => {
    dict[townLocation.townLocationId] = townLocation;
    return dict;
  }, {} as TownLocationsDict);
  dispatch(updatedTownLocations({ allIds: townLocationIds, byId }));
};

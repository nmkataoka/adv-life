import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TownLocationsDict, getTownLocationInfo } from '../../3-api/town';
import { AppThunk } from '../../7-app/types';

const initialState = {
  byId: {} as TownLocationsDict,
};

const townLocationSlice = createSlice({
  name: 'townLocation',
  initialState,
  reducers: {
    updatedTownLocations(state, action: PayloadAction<{byId: TownLocationsDict, allIds: number[]}>) {
      const { byId, allIds } = action.payload;
      allIds.forEach((townLocationId) => {
        state.byId[townLocationId] = byId[townLocationId];
      });
    },
  },
});

export const { updatedTownLocations } = townLocationSlice.actions;

export default townLocationSlice.reducer;

export const updateTownLocationsFromEngine = (townLocationIds: number[]): AppThunk => (dispatch) => {
  const townLocationInfos = townLocationIds.map((townLocationId) => getTownLocationInfo(townLocationId));
  const byId = townLocationInfos.reduce((dict, townLocation) => {
    dict[townLocation.townLocationId] = townLocation;
    return dict;
  }, {} as TownLocationsDict);
  dispatch(updatedTownLocations({ allIds: townLocationIds, byId }));
};

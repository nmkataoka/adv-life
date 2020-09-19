import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { travelToLocation, TravelToLocationPayload } from '../WorldMap/actions';

const initialState = {
  currentTownId: -1,
};

const townSceneSlice = createSlice({
  name: 'townScene',
  initialState,
  reducers: {
    setCurrentTown(state, action: PayloadAction<number>) {
      state.currentTownId = action.payload;
    },
  },
  extraReducers: {
    [travelToLocation.type]: (state, action: PayloadAction<TravelToLocationPayload>) => {
      const { payload: { id, locationType } } = action;
      switch (locationType) {
        case 'Combat':
          state.currentTownId = -1;
          break;
        case 'Town':
          state.currentTownId = id;
          break;
        default:
          break;
      }
    },
  },
});

export const { setCurrentTown } = townSceneSlice.actions;

export default townSceneSlice.reducer;

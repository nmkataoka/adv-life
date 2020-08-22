import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../7-app/types';
import { TownsDict } from '../../3-api/town';
import { getTowns } from '../../3-api/town/getTowns';

const initialState = {
  byId: {} as TownsDict,
};

const townSlice = createSlice({
  name: 'town',
  initialState,
  reducers: {
    updatedTowns(state, action: PayloadAction<TownsDict>) {
      state.byId = action.payload;
    },
  },
});

export const {
  updatedTowns,
} = townSlice.actions;

export default townSlice.reducer;

export const updateTownsFromEngine = (): AppThunk => (dispatch) => {
  const towns = getTowns();
  dispatch(updatedTowns(towns));
};

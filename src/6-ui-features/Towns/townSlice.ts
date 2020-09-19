import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../7-app/types';
import { TownsDict } from '../../3-frontend-api/town';
import { getTowns } from '../../3-frontend-api/town/getTowns';

const initialState = {
  byId: {} as TownsDict,
};

const townsSlice = createSlice({
  name: 'towns',
  initialState,
  reducers: {
    updatedTowns(state, action: PayloadAction<TownsDict>) {
      state.byId = action.payload;
    },
  },
});

export const {
  updatedTowns,
} = townsSlice.actions;

export default townsSlice.reducer;

export const updateTownsFromEngine = (): AppThunk => (dispatch) => {
  const towns = getTowns();
  dispatch(updatedTowns(towns));
};

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../7-app/types';
import { TownInfo } from '../../3-frontend-api/town';
import { getTowns } from '../../3-frontend-api/town/getTowns';
import { DictOf } from '../../4-helpers/DictOf';

const initialState = {
  byId: {} as DictOf<TownInfo>,
};

const townsSlice = createSlice({
  name: 'towns',
  initialState,
  reducers: {
    updatedTowns(state, action: PayloadAction<DictOf<TownInfo>>) {
      state.byId = action.payload;
    },
  },
});

export const { updatedTowns } = townsSlice.actions;

export default townsSlice.reducer;

export const updateTownsFromEngine = (): AppThunk => (dispatch) => {
  const towns = getTowns();
  dispatch(updatedTowns(towns));
};

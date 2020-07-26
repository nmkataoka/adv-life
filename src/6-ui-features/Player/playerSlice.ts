import { createSlice } from '@reduxjs/toolkit';
import { updatedUnits } from '../CombatScene/actions';

const initialState = {
  entityHandle: -1,
  gameIsOver: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerEntity(state, action) {
      state.entityHandle = action.payload;
    },
  },
  extraReducers: {
    [updatedUnits.type]: (state, action) => {
      const { units } = action.payload;
      if (units[state.entityHandle] == null) {
        state.gameIsOver = true;
      }
    },
  },
});

export const { setPlayerEntity } = playerSlice.actions;

export default playerSlice.reducer;

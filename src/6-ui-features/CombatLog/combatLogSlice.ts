import { createSlice } from '@reduxjs/toolkit';
import { GameManager } from '0-engine/GameManager';
import { CombatLogSys } from '1-game-code/Combat/CombatLogSys';
import { AppThunk } from '7-app/types';

const initialState = {
  entries: [] as string[],
};

const combatLogSlice = createSlice({
  name: 'combatLog',
  initialState,
  reducers: {
    updatedCombatLog(state, action) {
      state.entries = [...action.payload];
    },
  },
});

const { updatedCombatLog } = combatLogSlice.actions;

export default combatLogSlice.reducer;

export const updateCombatLogFromEngine = (): AppThunk => (dispatch) => {
  const { eMgr } = GameManager.instance;
  const combatLogSys = eMgr.getSys(CombatLogSys);
  const { entries } = combatLogSys;
  dispatch(updatedCombatLog(entries));
};

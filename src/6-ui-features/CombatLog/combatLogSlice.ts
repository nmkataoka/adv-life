import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../../7-app/types';
import { GameManager } from '../../0-engine/GameManager';
import { CombatLogSys } from '../../2-ecsystems/Combat/CombatLogSys';

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
  const combatLogSys = eMgr.GetSystem(CombatLogSys);
  const { entries } = combatLogSys;
  dispatch(updatedCombatLog(entries));
};

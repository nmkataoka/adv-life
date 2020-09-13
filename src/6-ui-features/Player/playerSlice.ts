import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updatedUnits } from '../CombatScene/actions';
import { AppThunk } from '../../7-app/types';
import { GetView } from '../../0-engine';
import { PlayerCmpt } from '../../1-game-code/ncomponents';
import { GameManager } from '../../0-engine/GameManager';

const initialState = {
  entityHandle: -1,
  gameIsOver: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerEntity(state, action: PayloadAction<number>) {
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

export const updatePlayerEntityFromEngine = (): AppThunk => (dispatch) => {
  const { eMgr } = GameManager.instance;
  const players = GetView(eMgr, 0, PlayerCmpt);
  let playerEntityHandle = -1;
  if (players.Count > 0) {
    playerEntityHandle = parseInt(players.At(0), 10);
  }
  dispatch(setPlayerEntity(playerEntityHandle));
};

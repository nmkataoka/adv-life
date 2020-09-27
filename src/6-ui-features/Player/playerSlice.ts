import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameManager } from '0-engine/GameManager';
import { AppThunk } from '7-app/types';
import { PlayerCmpt } from '1-game-code/ncomponents';
import { InventoryInfo } from '3-frontend-api/inventory/InventoryInfo';
import { updatedUnits } from '../CombatScene/actions';

const initialState = {
  playerId: -1,
  gameIsOver: false,
  inventory: { inventorySlots: [], gold: 0 } as InventoryInfo,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerEntity(state, action: PayloadAction<number>) {
      state.playerId = action.payload;
    },
  },
  extraReducers: {
    [updatedUnits.type]: (state, action) => {
      const { units } = action.payload;
      if (units[state.playerId] == null) {
        state.gameIsOver = true;
      }
    },
  },
});

export const { setPlayerEntity } = playerSlice.actions;

export default playerSlice.reducer;

export const updatePlayerEntityFromEngine = (): AppThunk => (dispatch) => {
  const { eMgr } = GameManager.instance;
  const players = eMgr.getView([PlayerCmpt], [], []);
  let playerEntityHandle = -1;
  if (players.count > 0) {
    playerEntityHandle = players.at(0);
  }
  dispatch(setPlayerEntity(playerEntityHandle));
};

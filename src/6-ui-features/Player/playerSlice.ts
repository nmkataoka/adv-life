import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetView } from '0-engine';
import { GameManager } from '0-engine/GameManager';
import { updatedUnits } from '../CombatScene/actions';
import { AppThunk } from '../../7-app/types';
import { PlayerCmpt } from '1-game-code/ncomponents';
import { InventoryInfo } from '../../3-frontend-api/inventory/InventoryInfo';
import { getInventoryInfo } from '../../3-frontend-api/inventory/getInventoryInfo';

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
    updatedPlayerInventory(state, action: PayloadAction<InventoryInfo>) {
      state.inventory = action.payload;
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

export const { setPlayerEntity, updatedPlayerInventory } = playerSlice.actions;

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

export const updatePlayerInventoryFromEngine = (): AppThunk => (dispatch, getState) => {
  const { playerId } = getState().player;
  const inventoryInfo = getInventoryInfo(playerId);
  dispatch(updatedPlayerInventory(inventoryInfo));
};

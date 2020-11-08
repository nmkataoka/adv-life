import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryInfo } from '3-frontend-api/inventory/InventoryInfo';

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
});

export const { setPlayerEntity } = playerSlice.actions;

export default playerSlice.reducer;

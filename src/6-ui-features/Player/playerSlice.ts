import { createSlice } from '@reduxjs/toolkit';
import { InventoryInfo } from '3-frontend-api/inventory/InventoryInfo';

const initialState = {
  gameIsOver: false,
  inventory: { inventorySlots: [], gold: 0 } as InventoryInfo,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {},
});

export default playerSlice.reducer;

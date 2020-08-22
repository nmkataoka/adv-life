import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  currentTownId: -1,
};

const townSceneSlice = createSlice({
  name: 'townScene',
  initialState,
  reducers: {
    setCurrentTown(state, action: PayloadAction<number>) {
      state.currentTownId = action.payload;
    },
  },
});

export const { setCurrentTown } = townSceneSlice.actions;

export default townSceneSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  useShearedElev: false,
};

const worldMapSlice = createSlice({
  name: 'worldMap',
  initialState,
  reducers: {
    setUseShearedElev(state, action: PayloadAction<boolean>) {
      state.useShearedElev = action.payload;
    },
  },
});

export const { setUseShearedElev } = worldMapSlice.actions;

export default worldMapSlice.reducer;

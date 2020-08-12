import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  title: '',
};

const topBarSlice = createSlice({
  name: 'topBar',
  initialState,
  reducers: {
    changedTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
  },
});

export const {
  changedTitle,
} = topBarSlice.actions;

export default topBarSlice.reducer;

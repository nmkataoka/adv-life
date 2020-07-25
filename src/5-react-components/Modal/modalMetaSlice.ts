import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  // Modals use this global counter to ensure they open in front of older modals
  // Technically it can max out at 2 billion, but that seems unlikely
  nextZIndex: 1,
};

const modalMetaSlice = createSlice({
  name: 'combatLog',
  initialState,
  reducers: {
    usedModalZIndex(state, action: PayloadAction<number>) {
      const usedZIndex = action.payload;
      if (usedZIndex >= 2000000000) {
        throw new Error('Modal global counter is over 2 billion. '
        + "This likely indicates an error elsewhere unless you've been playing for centuries.");
      }
      if (usedZIndex >= state.nextZIndex) {
        state.nextZIndex = usedZIndex + 1;
      }
    },
  },
});

export const { usedModalZIndex } = modalMetaSlice.actions;

export default modalMetaSlice.reducer;

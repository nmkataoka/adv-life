import { createSlice } from '@reduxjs/toolkit';

export enum Scenes {
  Combat = 'combat',
  Town = 'town',
}

const initialState = {
  currentScene: Scenes.Town,
};

const sceneMetaSlice = createSlice({
  name: 'sceneMeta',
  initialState,
  reducers: {
    changedScene(state, action) {
      state.currentScene = action.payload;
    },
  },
});

export default sceneMetaSlice.reducer;

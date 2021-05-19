import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Scene = 'characterCreation' | 'colosseum' | 'mainMenu' | 'town' | 'worldGen';

const initialState = {
  currentScene: 'mainMenu' as Scene,
};

const sceneMetaSlice = createSlice({
  name: 'sceneMeta',
  initialState,
  reducers: {
    changedScene(state, action: PayloadAction<Scene>) {
      state.currentScene = action.payload;
    },
  },
});

export const { changedScene } = sceneMetaSlice.actions;

export default sceneMetaSlice.reducer;

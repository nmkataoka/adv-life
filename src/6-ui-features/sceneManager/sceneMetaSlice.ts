import { createSlice } from '@reduxjs/toolkit';

export enum Scenes {
  CharacterCreation = 'characterCreation',
  Combat = 'combat',
  Town = 'town',
}

const initialState = {
  currentScene: Scenes.CharacterCreation,
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

export const { changedScene } = sceneMetaSlice.actions;

export default sceneMetaSlice.reducer;

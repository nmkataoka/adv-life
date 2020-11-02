import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Scene {
  CharacterCreation = 'characterCreation',
  Colosseum = 'colosseum',
  Combat = 'combat',
  MainMenu = 'mainMenu',
  Town = 'town',
}

const initialState = {
  currentScene: Scene.MainMenu,
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

import { RootState } from '7-app/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WorldGenModules, WorldGenModule } from './constants';

const initialState = {
  activeModule: Object.values(WorldGenModules)[0].key,
};

const worldGenSceneSlice = createSlice({
  name: 'worldGenScene',
  initialState,
  reducers: {
    selectedModule(state, action: PayloadAction<WorldGenModule>) {
      state.activeModule = action.payload;
    },
  },
});

export default worldGenSceneSlice.reducer;

export const { selectedModule } = worldGenSceneSlice.actions;

export const getActiveModule = (state: RootState): WorldGenModule =>
  state.worldGenScene.activeModule;

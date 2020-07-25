import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import combatLogReducer from '../6-ui-features/CombatLog/combatLogSlice';
import combatSceneReducer from '../6-ui-features/CombatScene/combatSceneSlice';
import sceneMetaReducer from '../6-ui-features/sceneManager/sceneMetaSlice';

export const store = configureStore({
  reducer: {
    combatLog: combatLogReducer,
    combatScene: combatSceneReducer,
    sceneMeta: sceneMetaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import combatLogReducer from '../6-ui-features/combatLog/combatLogSlice';
import combatSceneReducer from '../6-ui-features/CombatScene/combatSceneSlice';

export const store = configureStore({
  reducer: {
    combatLog: combatLogReducer,
    combatScene: combatSceneReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../6-ui-features/counter/counterSlice";
import combatSceneReducer from "../6-ui-features/CombatScene/combatSceneSlice";

export const store = configureStore({
  reducer: {
    combatScene: combatSceneReducer,
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

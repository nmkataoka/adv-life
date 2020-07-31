import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const CharacterCreationScreens = ['Race', 'Class', 'Attributes', 'Personality'];

const initialState = {
  screen: 'Race',
  infoWindowTitle: '',
  infoWindowText: '',
};

const characterCreationSlice = createSlice({
  name: 'characterCreation',
  initialState,
  reducers: {
    changedScreen(state, action: PayloadAction<string>) {
      state.screen = action.payload;
      clearInfoWindow(state);
    },
    updateInfoWindow(
      state,
      action: PayloadAction<{infoWindowTitle: string, infoWindowText: string}>,
    ) {
      const { infoWindowTitle, infoWindowText } = action.payload;
      state.infoWindowTitle = infoWindowTitle;
      state.infoWindowText = infoWindowText;
    },
    clickedNext(state) {
      const curScreenIdx = CharacterCreationScreens.findIndex((screen) => screen === state.screen);
      if (curScreenIdx < CharacterCreationScreens.length - 1) {
        state.screen = CharacterCreationScreens[curScreenIdx + 1];
        clearInfoWindow(state);
      }
    },
    clickedPrevious(state) {
      const curScreenIdx = CharacterCreationScreens.findIndex((screen) => screen === state.screen);
      if (curScreenIdx > 0) {
        state.screen = CharacterCreationScreens[curScreenIdx - 1];
        clearInfoWindow(state);
      }
    },
  },
});

function clearInfoWindow(state: typeof initialState) {
  state.infoWindowTitle = '';
  state.infoWindowText = '';
}

export const {
  changedScreen,
  clickedNext,
  clickedPrevious,
  updateInfoWindow,
} = characterCreationSlice.actions;

export default characterCreationSlice.reducer;

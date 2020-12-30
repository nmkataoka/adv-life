import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '7-app/types';
import { PersonalityArray } from '1-game-code/ncomponents/PersonalityCmpt';
import apiClient from '3-frontend-api/ApiClient';
import { getTowns } from '3-frontend-api/town';
import { getPlayerId } from '3-frontend-api';
import { createCharacter } from '1-game-code/CharacterCreation/CharacterCreationSys';
import { createWorldMap } from '1-game-code/World/TerrainGen/TerrainGenSys';
import { initialCharacterAttributeGroups } from './characterCreationData';
import CharacterAttributeGroup, {
  PointAllocation,
  Ranges,
  randomize,
  OneOf,
} from './CharacterAttributeGroup';
import { Freeform } from './CharacterAttributeGroup/Freeform';
import { setPlayerEntity } from '../Player/playerSlice';
import { changedScene, Scene } from '../sceneManager/sceneMetaSlice';
import { travelToLocation } from '../WorldMap/actions';

/* eslint-disable no-console */

const randomizeCharacterAttributeGroups = (cags: CharacterAttributeGroup[]) => {
  cags.forEach((cag) => {
    randomize(cag);
  });
};

const characterAttributeGroups = initialCharacterAttributeGroups;
randomizeCharacterAttributeGroups(characterAttributeGroups);

const initialState = {
  screenIdx: 0,
  infoWindowTitle: '',
  infoWindowText: '',

  characterAttributeGroups,
};

const clamp = (num: number, min: number, max: number) => Math.min(max, Math.max(min, num));

const countUsedPoints = (characterAttributeGroup: PointAllocation) =>
  characterAttributeGroup.options.reduce((sum, option) => sum + option.value, 0);

const characterCreationSlice = createSlice({
  name: 'characterCreation',
  initialState,
  reducers: {
    changedScreen(state, action: PayloadAction<string>) {
      const screenName = action.payload;
      const newScreenIdx = state.characterAttributeGroups.findIndex(
        (cag) => cag.name === screenName,
      );
      if (newScreenIdx >= 0) {
        state.screenIdx = newScreenIdx;
        clearInfoWindow(state);
      }
    },
    updateInfoWindow(
      state,
      action: PayloadAction<{ infoWindowTitle: string; infoWindowText: string }>,
    ) {
      const { infoWindowTitle, infoWindowText } = action.payload;
      state.infoWindowTitle = infoWindowTitle;
      state.infoWindowText = infoWindowText;
    },
    clickedNext(state) {
      if (state.screenIdx < state.characterAttributeGroups.length - 1) {
        state.screenIdx += 1;
        clearInfoWindow(state);
      }
    },
    clickedPrevious(state) {
      if (state.screenIdx > 0) {
        state.screenIdx -= 1;
        clearInfoWindow(state);
      }
    },
    selectedOption(state, action: PayloadAction<{ label: string }>) {
      const { label } = action.payload;
      const characterAttributeGroup = state.characterAttributeGroups[state.screenIdx] as OneOf;
      const { options } = characterAttributeGroup;
      const selectedIdx = options.findIndex((o) => o.label === label);
      if (options == null) {
        console.error(`Could not find option ${label} to select.`);
        return;
      }
      characterAttributeGroup.selectedIdx = selectedIdx;
    },
    increasedPointAllocationForAttribute(state, action: PayloadAction<{ label: string }>) {
      const { label } = action.payload;
      const characterAttributeGroup = state.characterAttributeGroups[
        state.screenIdx
      ] as PointAllocation;
      const { options, totalPoints } = characterAttributeGroup;
      const option = options.find((o) => o.label === label);
      if (option == null) {
        console.error(`Could not find attribute ${label} to increase point allocation for.`);
        return;
      }
      const usedPoints = countUsedPoints(characterAttributeGroup);
      if (usedPoints < totalPoints) {
        const { max, min, value } = option;
        option.value = clamp(value + 1, min, max);
      }
    },
    decreasedPointAllocationForAttribute(state, action: PayloadAction<{ label: string }>) {
      const { label } = action.payload;
      const characterAttributeGroup = state.characterAttributeGroups[
        state.screenIdx
      ] as PointAllocation;
      const { options } = characterAttributeGroup;
      const option = options.find((o) => o.label === label);
      if (option == null) {
        console.error(`Could not find attribute ${label} to decrease point allocation for.`);
        return;
      }
      const { max, min, value } = option;
      option.value = clamp(value - 1, min, max);
    },
    changedSlider(state, action: PayloadAction<{ label: string; value: number }>) {
      const { label, value } = action.payload;
      const characterAttributeGroup = state.characterAttributeGroups[state.screenIdx] as Ranges;
      const { options } = characterAttributeGroup;
      const option = options.find((o) => o.maxLabel === label);
      if (option == null) {
        console.error(`Could not find attribute ${label} to decrease point allocation for.`);
        return;
      }
      const { max, min } = option;
      option.value = clamp(value, min, max);
    },
    changedFreeformInputValue(state, action: PayloadAction<{ label: string; value: string }>) {
      const { label, value } = action.payload;
      const characterAttributeGroup = state.characterAttributeGroups[state.screenIdx] as Freeform;
      const { options } = characterAttributeGroup;
      const option = options.find((o) => o.label === label);
      if (option == null) {
        console.error(`Could not find input ${label} to change freeform input.`);
        return;
      }
      option.value = value;
    },
    randomizeAll(state) {
      randomizeCharacterAttributeGroups(state.characterAttributeGroups);
    },
    randomizeCurrentWindow(state) {
      const characterAttributeGroup = state.characterAttributeGroups[state.screenIdx];
      randomize(characterAttributeGroup);
    },
  },
});

function clearInfoWindow(state: typeof initialState) {
  state.infoWindowTitle = '';
  state.infoWindowText = '';
}

export const {
  changedFreeformInputValue,
  changedScreen,
  changedSlider,
  clickedNext,
  clickedPrevious,
  decreasedPointAllocationForAttribute,
  increasedPointAllocationForAttribute,
  randomizeAll,
  randomizeCurrentWindow,
  selectedOption,
  updateInfoWindow,
} = characterCreationSlice.actions;

export default characterCreationSlice.reducer;

export const createPlayerCharacter = (): AppThunk => async (dispatch, getState) => {
  // This is temporary, we'll make a world gen area later.
  await apiClient.emit(createWorldMap());

  const {
    characterCreation: { characterAttributeGroups: cags },
  } = getState();

  const nameCAG = cags.find((cag) => cag.name === 'Name') as Freeform;
  let name;
  if (nameCAG) {
    name = nameCAG.options[0].value;
  }

  const raceCAG = cags.find((cag) => cag.name === 'Race') as OneOf;
  let race;
  if (raceCAG) {
    race = raceCAG.options[raceCAG.selectedIdx].label;
  }

  const classCAG = cags.find((cag) => cag.name === 'Class') as OneOf;
  let className;
  if (classCAG) {
    className = classCAG.options[classCAG.selectedIdx].label;
  }

  const statsCAG = cags.find((cag) => cag.name === 'Attributes') as PointAllocation;
  let stats;
  if (statsCAG) {
    const [
      { value: strength },
      { value: dexterity },
      { value: stamina },
      { value: magicalAffinity },
      { value: intelligence },
    ] = statsCAG.options;
    stats = {
      strength,
      dexterity,
      stamina,
      magicalAffinity,
      intelligence,
    };
  }

  const personalityCAG = cags.find((cag) => cag.name === 'Personality') as Ranges;
  let personality;
  if (personalityCAG) {
    personality = personalityCAG.options.map((option) => option.value) as PersonalityArray;
  }

  await apiClient.emit(
    createCharacter({
      className,
      name: name ?? 'Unnamed',
      personality,
      race,
      stats,
    }),
  );

  const playerId = apiClient.get(getPlayerId);
  apiClient.setHeader('userId', playerId);
  dispatch(setPlayerEntity(playerId));
};

export const finishCharacterCreation = (): AppThunk => (dispatch) => {
  dispatch(createPlayerCharacter());
  const firstTown = Object.values(getTowns())[0];
  dispatch(travelToLocation({ id: firstTown.townId, locationType: 'Town' }));
  dispatch(changedScene(Scene.Town));
};

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '7-app/types';
import { PersonalityArray } from '1-game-code/ncomponents/PersonalityCmpt';
import apiClient from '3-frontend-api/ApiClient';
import { createCharacter } from '1-game-code/CharacterCreation/CharacterCreationSys';
import { NMath } from '8-helpers/math';
import { consoleError } from '8-helpers/console';
import { initialCharacterAttributeGroups } from './characterCreationData';
import CharacterAttributeGroup, {
  PointAllocation,
  Ranges,
  randomize,
  OneOf,
  isOneOf,
} from './CharacterAttributeGroup';
import { Freeform } from './CharacterAttributeGroup/Freeform';

const randomizeCharacterAttributeGroups = (cags: CharacterAttributeGroup[]) => {
  cags.forEach((cag) => {
    randomize(cag);
  });
};

const characterAttributeGroups = initialCharacterAttributeGroups;
randomizeCharacterAttributeGroups(characterAttributeGroups);

const initialState = {
  screenIdx: 0,

  characterAttributeGroups,
};

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
      }
    },
    /** Use to update CAG metadata. Do not use this to update input values! */
    updateCharacterAttributeGroup(state, action: PayloadAction<CharacterAttributeGroup>) {
      const cag = action.payload;
      const cagIdx = state.characterAttributeGroups.findIndex((c) => c.name === cag.name);
      if (cagIdx < 0) {
        throw new Error(
          "Tried to update character attribute group ' + cag.name + ' but it doesn't exist.",
        );
      }
      state.characterAttributeGroups[cagIdx] = cag;
    },
    clickedNext(state) {
      if (state.screenIdx < state.characterAttributeGroups.length - 1) {
        state.screenIdx += 1;
      }
    },
    clickedPrevious(state) {
      if (state.screenIdx > 0) {
        state.screenIdx -= 1;
      }
    },
    selectedOption(state, action: PayloadAction<{ label: string }>) {
      const { label } = action.payload;
      const characterAttributeGroup = state.characterAttributeGroups[state.screenIdx] as OneOf;
      const { options } = characterAttributeGroup;
      const selectedIdx = options.findIndex((o) => o.label === label);
      if (options == null) {
        consoleError(`Could not find option ${label} to select.`);
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
        consoleError(`Could not find attribute ${label} to increase point allocation for.`);
        return;
      }
      const usedPoints = countUsedPoints(characterAttributeGroup);
      if (usedPoints < totalPoints) {
        const { max, min, value } = option;
        option.value = NMath.clamp(value + 1, min, max);
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
        consoleError(`Could not find attribute ${label} to decrease point allocation for.`);
        return;
      }
      const { max, min, value } = option;
      option.value = NMath.clamp(value - 1, min, max);
    },
    changedSlider(state, action: PayloadAction<{ label: string; value: number }>) {
      const { label, value } = action.payload;
      const characterAttributeGroup = state.characterAttributeGroups[state.screenIdx] as Ranges;
      const { options } = characterAttributeGroup;
      const option = options.find((o) => o.maxLabel === label);
      if (option == null) {
        consoleError(`Could not find attribute ${label} to decrease point allocation for.`);
        return;
      }
      const { max, min } = option;
      option.value = NMath.clamp(value, min, max);
    },
    changedFreeformInputValue(state, action: PayloadAction<{ label: string; value: string }>) {
      const { label, value } = action.payload;
      const characterAttributeGroup = state.characterAttributeGroups[state.screenIdx] as Freeform;
      const { options } = characterAttributeGroup;
      const option = options.find((o) => o.label === label);
      if (option == null) {
        consoleError(`Could not find input ${label} to change freeform input.`);
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
  updateCharacterAttributeGroup,
} = characterCreationSlice.actions;

export default characterCreationSlice.reducer;

/**
 * Returns the value of a character attribute group, identified by name
 * @param cags Character attribute group array
 * @param name Name of the cag
 */
function getOneOfValue(cags: CharacterAttributeGroup[], name: string): string {
  const cag = cags.find((c) => c.name === name);
  if (!cag) {
    throw new Error(`Could not find character attribute ${name}`);
  }
  if (!isOneOf(cag)) {
    throw new Error('Character attribute is of different selectType than expected.');
  }
  return cag.options[cag.selectedIdx].value;
}

export const createPlayerCharacter = (): AppThunk => async (dispatch, getState) => {
  const {
    characterCreation: { characterAttributeGroups: cags },
  } = getState();

  const nameCAG = cags.find((cag) => cag.name === 'Name') as Freeform;
  let name;
  if (nameCAG) {
    name = nameCAG.options[0].value;
  }

  const race = getOneOfValue(cags, 'Race');
  const className = getOneOfValue(cags, 'Class');
  const civId = parseInt(getOneOfValue(cags, 'Civilization'), 10);

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
      civ: { id: civId, admin: true },
      className,
      name: name ?? 'Unnamed',
      personality,
      race,
      stats,
    }),
  );
};

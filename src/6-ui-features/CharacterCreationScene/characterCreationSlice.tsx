import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const CharacterCreationScreens = ['Race', 'Class', 'Attributes', 'Personality'];

export type OneOfData = {
  label: string;
  info: string;
}

export type PlusMinusData = {
  label: string;
  info: string;
  value: number;
  min: number;
  max: number;
}

export type SliderData = {
  minLabel: string;
  maxLabel: string;
  info: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export type CharacterAttributeGroupOneOf = {
  name: string;
  selectType: 'oneOf';
  options: OneOfData[];
}

export type CharacterAttributeGroupPointAllocation = {
  name: string;
  selectType: 'pointAllocation';
  options: PlusMinusData[];
  totalPoints: number;
}

export type CharacterAttributeGroupRanges = {
  name: string;
  selectType: 'ranges';
  options: SliderData[];
}

export type CharacterAttributeGroup = CharacterAttributeGroupOneOf
| CharacterAttributeGroupPointAllocation
| CharacterAttributeGroupRanges;

const initialCharacterAttributeGroups: CharacterAttributeGroup[] = [
  {
    name: 'Race',
    selectType: 'oneOf',
    options: [
      { label: 'Human', info: "A boring choice that you surely won't choose." },
      { label: 'Elf', info: 'Tree lovers.' },
      { label: 'Dwarf', info: 'Short and stocky miners who consume an abundance of alcohol.' },
      { label: 'Goblin', info: 'Even shorter.' },
    ],
  },
  {
    name: 'Class',
    selectType: 'oneOf',
    options: [
      { label: 'Fighter', info: 'A front line warrior.' },
      { label: 'Mage', info: 'A scholar of the arcane.' },
      { label: 'Thief', info: 'A quick and crafty scoundrel.' },
    ],
  },
  {
    name: 'Attributes',
    selectType: 'pointAllocation',
    options: [
      {
        label: 'Strength',
        info: 'A measure of physical strength.',
        value: 10,
        min: 0,
        max: 20,
      },
      {
        label: 'Dexterity',
        info: 'A measure of physical coordination and precision of movement',
        value: 10,
        min: 0,
        max: 20,
      },
      {
        label: 'Stamina',
        info: 'A measure of how quickly one tires',
        value: 10,
        min: 0,
        max: 20,
      },
      {
        label: 'Magical Affinity',
        info: 'A measure of whether one is naturally gifted in the arcane arts',
        value: 10,
        min: 0,
        max: 20,
      },
      {
        label: 'Intelligence',
        info: 'A measure of mental faculties',
        value: 10,
        min: 0,
        max: 20,
      },
    ],
    totalPoints: 50,
  },
  /* eslint-disable max-len */
  {
    name: 'Personality',
    selectType: 'ranges',
    options: [
      {
        minLabel: 'Dishonest-Greedy',
        maxLabel: 'Honest-Humble',
        info: 'Persons with very high scores on the Honesty-Humility scale avoid manipulating others for personal gain, feel little temptation to break rules, are uninterested in lavish wealth and luxuries, and feel no special entitlement to elevated social status. Conversely, persons with very low scores on this scale will flatter others to get what they want, are inclined to break rules for personal profit, are motivated by material gain, and feel a strong sense of self-importance.',
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        minLabel: 'Stoic',
        maxLabel: 'Emotional',
        info: "Persons with very high scores on the Emotionality scale experience fear of physical dangers, experience anxiety in response to life's stresses, feel a need for emotional support from others, and feel empathy and sentimental attachments with others. Conversely, persons with very low scores on this scale are not deterred by the prospect of physical harm, feel little worry even in stressful situations, have little need to share their concerns with others, and feel emotionally detached from others.",
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        minLabel: 'Introverted',
        maxLabel: 'Extraverted',
        info: 'Persons with very high scores on the Extraversion scale feel positively about themselves, feel confident when leading or addressing groups of people, enjoy social gatherings and interactions, and experience positive feelings of enthusiasm and energy. Conversely, persons with very low scores on this scale consider themselves unpopular, feel awkward when they are the center of social attention, are indifferent to social activities, and feel less lively and optimistic than others do.',
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        minLabel: 'Stubborn-Angry',
        maxLabel: 'Agreeable',
        info: "Persons with very high scores on the Agreeableness scale forgive the wrongs that they suffered, are lenient in judging others, are willing to compromise and cooperate with others, and can easily control their temper. Conversely, persons with very low scores on this scale hold grudges against those who have harmed them, are rather critical of others' shortcomings, are stubborn in defending their point of view, and feel anger readily in response to mistreatment.",
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        minLabel: 'Irresponsible',
        maxLabel: 'Conscientious',
        info: 'Persons with very high scores on the Conscientiousness scale organize their time and their physical surroundings, work in a disciplined way toward their goals, strive for accuracy and perfection in their tasks, and deliberate carefully when making decisions. Conversely, persons with very low scores on this scale tend to be unconcerned with orderly surroundings or schedules, avoid difficult tasks or challenging goals, are satisfied with work that contains some errors, and make decisions on impulse or with little reflection.',
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        minLabel: 'Closed to Experience',
        maxLabel: 'Open to Experience',
        info: 'Persons with very high scores on the Openness to Experience scale become absorbed in the beauty of art and nature, are inquisitive about various domains of knowledge, use their imagination freely in everyday life, and take an interest in unusual ideas or people. Conversely, persons with very low scores on this scale are rather unimpressed by most works of art, feel little intellectual curiosity, avoid creative pursuits, and feel little attraction toward ideas that may seem radical or unconventional.',
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
    ],
  },
  /* eslint-enable max-len */
];

const initialState = {
  screenIdx: 0,
  infoWindowTitle: '',
  infoWindowText: '',

  characterAttributeGroups: initialCharacterAttributeGroups,
};

const characterCreationSlice = createSlice({
  name: 'characterCreation',
  initialState,
  reducers: {
    changedScreen(state, action: PayloadAction<string>) {
      const screenName = action.payload;
      const newScreenIdx = state.characterAttributeGroups.findIndex((cag) => cag.name === screenName);
      if (newScreenIdx >= 0) {
        state.screenIdx = newScreenIdx;
        clearInfoWindow(state);
      }
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

import CharacterAttributeGroup from './CharacterAttributeGroup';

export const initialCharacterAttributeGroups: CharacterAttributeGroup[] = [
  {
    name: 'Name',
    selectType: 'freeform',
    options: [{ label: 'Name', type: 'text', value: '' }],
  },
  {
    name: 'Race',
    selectType: 'oneOf',
    options: [
      { label: 'Human', info: "A boring choice that you surely won't choose.", value: 'human' },
      { label: 'Elf', info: 'Tree lovers.', value: 'elf' },
      {
        label: 'Dwarf',
        info: 'Short and stocky miners who consume an abundance of alcohol.',
        value: 'dwarf',
      },
      { label: 'Goblin', info: 'Even shorter.', value: 'goblin' },
    ],
    selectedIdx: 0,
  },
  {
    name: 'Civilization',
    selectType: 'oneOf',
    options: [{ label: 'Error', info: 'There was an issue loading civilizations.', value: '-1' }],
    selectedIdx: 0,
  },
  {
    name: 'Class',
    selectType: 'oneOf',
    options: [
      { label: 'Fighter', info: 'A front line warrior.', value: 'fighter' },
      { label: 'Mage', info: 'A scholar of the arcane.', value: 'mage' },
      { label: 'Thief', info: 'A quick and crafty scoundrel.', value: 'thief' },
    ],
    selectedIdx: 0,
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
        info:
          'Persons with very high scores on the Honesty-Humility scale avoid manipulating others for personal gain, feel little temptation to break rules, are uninterested in lavish wealth and luxuries, and feel no special entitlement to elevated social status. Conversely, persons with very low scores on this scale will flatter others to get what they want, are inclined to break rules for personal profit, are motivated by material gain, and feel a strong sense of self-importance.',
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        minLabel: 'Stoic',
        maxLabel: 'Emotional',
        info:
          "Persons with very high scores on the Emotionality scale experience fear of physical dangers, experience anxiety in response to life's stresses, feel a need for emotional support from others, and feel empathy and sentimental attachments with others. Conversely, persons with very low scores on this scale are not deterred by the prospect of physical harm, feel little worry even in stressful situations, have little need to share their concerns with others, and feel emotionally detached from others.",
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        minLabel: 'Introverted',
        maxLabel: 'Extraverted',
        info:
          'Persons with very high scores on the Extraversion scale feel positively about themselves, feel confident when leading or addressing groups of people, enjoy social gatherings and interactions, and experience positive feelings of enthusiasm and energy. Conversely, persons with very low scores on this scale consider themselves unpopular, feel awkward when they are the center of social attention, are indifferent to social activities, and feel less lively and optimistic than others do.',
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        minLabel: 'Stubborn-Angry',
        maxLabel: 'Agreeable',
        info:
          "Persons with very high scores on the Agreeableness scale forgive the wrongs that they suffered, are lenient in judging others, are willing to compromise and cooperate with others, and can easily control their temper. Conversely, persons with very low scores on this scale hold grudges against those who have harmed them, are rather critical of others' shortcomings, are stubborn in defending their point of view, and feel anger readily in response to mistreatment.",
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        minLabel: 'Irresponsible',
        maxLabel: 'Conscientious',
        info:
          'Persons with very high scores on the Conscientiousness scale organize their time and their physical surroundings, work in a disciplined way toward their goals, strive for accuracy and perfection in their tasks, and deliberate carefully when making decisions. Conversely, persons with very low scores on this scale tend to be unconcerned with orderly surroundings or schedules, avoid difficult tasks or challenging goals, are satisfied with work that contains some errors, and make decisions on impulse or with little reflection.',
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
      {
        minLabel: 'Closed to Experience',
        maxLabel: 'Open to Experience',
        info:
          'Persons with very high scores on the Openness to Experience scale become absorbed in the beauty of art and nature, are inquisitive about various domains of knowledge, use their imagination freely in everyday life, and take an interest in unusual ideas or people. Conversely, persons with very low scores on this scale are rather unimpressed by most works of art, feel little intellectual curiosity, avoid creative pursuits, and feel little attraction toward ideas that may seem radical or unconventional.',
        value: 3,
        min: 1,
        max: 5,
        step: 1,
      },
    ],
  },
  /* eslint-enable max-len */
];

export const CharacterCreationScreens = initialCharacterAttributeGroups.map((cag) => cag.name);

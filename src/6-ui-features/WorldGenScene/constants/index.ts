import produce from 'immer';
import { rainControls } from './rainControls';
import { terrainGenControls, terrainGenControlsTest } from './terrainGenControls';

const blank = [{ heading: 'No configuration options.', options: [] }];

const finishControls = [
  {
    heading:
      'This will take you back to the home screen with the world saved. WARNING: there is no persistent save, so refreshing or closing the window will delete the world.',
    options: [],
  },
];

export const WorldGenModules = [
  { text: 'Terrain', key: 'terrain', content: terrainGenControls },
  { text: 'Weather', key: 'weather', content: blank },
  { text: 'Water', key: 'water', content: rainControls },
  { text: 'Civilizations', key: 'civilizations', content: blank },
  { text: 'Finish', key: 'finish', content: finishControls },
] as const;

export type WorldGenModule = typeof WorldGenModules[number]['key'];

export const WorldGenModulesTest = produce(WorldGenModules, (draft) => {
  draft[0].content = terrainGenControlsTest;
});

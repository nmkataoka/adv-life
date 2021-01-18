import produce from 'immer';
import { terrainGenControls, terrainGenControlsTest } from './terrainGenControls';

const blank = [{ heading: 'No configuration options.', options: [] }];

export const WorldGenModules = [
  { text: 'Terrain', key: 'terrain', content: terrainGenControls },
  { text: 'Weather', key: 'weather', content: blank },
  { text: 'Water', key: 'water', content: blank },
  { text: 'Civilizations', key: 'civilizations', content: blank },
] as const;

export type WorldGenModule = typeof WorldGenModules[number]['key'];

export const WorldGenModulesTest = produce(WorldGenModules, (draft) => {
  draft[0].content = terrainGenControlsTest;
});

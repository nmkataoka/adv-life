import produce from 'immer';
import { terrainGenControls, terrainGenControlsTest } from './terrainGenControls';

const blank = [{ heading: 'No configuration options.', options: [] }];

export const WorldGenTabs = [
  { text: 'Terrain', key: 'terrain', content: terrainGenControls },
  { text: 'Weather', key: 'weather', content: blank },
  { text: 'Water', key: 'water', content: blank },
  { text: 'Civilizations', key: 'civilizations', content: blank },
] as const;

export const WorldGenTabsTest = produce(WorldGenTabs, (draft) => {
  draft[0].content = terrainGenControlsTest;
});

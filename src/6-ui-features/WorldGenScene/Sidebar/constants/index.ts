import { terrainGenControls } from './terrainGenControls';

const blank = [{ heading: 'No configuration options.', options: [] }];

export const WorldGenTabs = [
  { text: 'Terrain', key: 'terrain', content: terrainGenControls },
  { text: 'Weather', key: 'weather', content: blank },
  { text: 'Water', key: 'water', content: blank },
  { text: 'Civilizations', key: 'civilizations', content: blank },
] as const;

import { createNoiseSettings } from './createNoiseSettings';
import { TabContentProps } from '../TabContent';

export const terrainGenControls: TabContentProps['content'] = [
  {
    heading: 'General',
    options: [
      {
        name: 'Width (tiles)',
        description: 'Map width in tiles. 1 tile = 4092 m.',
        value: 800,
        min: 100,
        max: 1600,
        step: 50,
      },
      {
        name: 'Height (tiles)',
        description: 'Map height in tiles. 1 tile = 4092 m.',
        value: 400,
        min: 50,
        max: 800,
        step: 50,
      },
      {
        name: 'Tectonic Plates',
        description: 'Number of tectonic plates.',
        value: 7,
        min: 5,
        max: 30,
        step: 1,
      },
      {
        name: 'Percent Ocean',
        description:
          'Percent of plates that are oceanic. When set to 0, all plates will be continental.',
        value: 65,
        min: 0,
        max: 100,
        step: 1,
      },
    ],
  },
  // Noise settings for fault perturbation
  {
    heading: 'Fault Shape',
    options: createNoiseSettings({
      scale: 425,
      frequency: 2 * 10 ** -4,
      octaves: 10,
      lacunarity: 1.85,
      gain: 0.53,
    }),
  },
  {
    heading: 'Fault Features',
    options: [
      {
        name: 'Coast Slope',
        description:
          'Average slope of coastal areas. A low value means large coastal areas, beaches, and continental shelves.',
        value: 50 / 100000,
        min: 5 / 100000,
        max: 100 / 100000,
        step: 5 / 100000,
      },
      {
        name: 'Mountain Slope',
        description:
          'Average slope of mountains. A low value leads to large mountainous regions, but the generator may have difficulty fitting them in.',
        value: 0.01,
        min: 0.002,
        max: 0.02,
        step: 0.01,
      },
      {
        name: 'Rift Slope',
        description:
          "Average slope of rifts. You won't interact with this much since most rifts are underwater.",
        value: 0.01,
        min: 0.002,
        max: 0.02,
        step: 0.01,
      },
    ],
  },
  {
    heading: 'Low Frequency Noise',
    options: createNoiseSettings({
      scale: 2000,
      frequency: 0.003,
      octaves: 8,
      lacunarity: 2.0,
      gain: 0.5,
    }),
  },
  {
    heading: 'Ridge Noise',
    options: createNoiseSettings({
      scale: 5000, // Corresponds to maximum `hilliness`
      frequency: 0.012,
      octaves: 10,
      lacunarity: 2,
      gain: 0.55,
    }),
  },
];

import produce from 'immer';
import { createNoiseSettings } from './createNoiseSettings';
import { TabContentProps } from '../Sidebar/TabContent';

export const terrainGenControls: TabContentProps['content'] = [
  {
    heading: 'General',
    options: [
      {
        name: 'Width (tiles)',
        key: 'width',
        description: 'Map width in tiles. 1 tile = 4092 m.',
        value: 800,
        min: 100,
        max: 1600,
        step: 50,
      },
      {
        name: 'Height (tiles)',
        key: 'height',
        description: 'Map height in tiles. 1 tile = 4092 m.',
        value: 400,
        min: 50,
        max: 800,
        step: 50,
      },
      {
        name: 'Tectonic Plates',
        key: 'numPlates',
        description: 'Number of tectonic plates.',
        value: 7,
        min: 5,
        max: 30,
        step: 1,
      },
      {
        name: 'Percent Ocean',
        key: 'oceanFrac',
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
    options: createNoiseSettings('faultPerturbation', {
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
        key: 'coastSlope',
        description:
          'Average slope of coastal areas. A low value means large coastal areas, beaches, and continental shelves.',
        value: 400 / 100000,
        min: 50 / 100000,
        max: 1000 / 100000,
        step: 50 / 100000,
      },
      {
        name: 'Mountain Slope',
        key: 'ridgeSlope',
        description:
          'Average slope of mountains. A low value leads to large mountainous regions, but the generator may have difficulty fitting them in.',
        value: 0.016,
        min: 0.002,
        max: 0.03,
        step: 0.002,
      },
      {
        name: 'Rift Slope',
        key: 'riftSlope',
        description:
          "Average slope of rifts. You won't interact with this much since most rifts are underwater.",
        value: 0.05,
        min: 0.002,
        max: 0.1,
        step: 0.002,
      },
    ],
  },
  {
    heading: 'Low Frequency Noise',
    options: createNoiseSettings('lowFreqNoise', {
      scale: 1500,
      frequency: 0.005,
      octaves: 8,
      lacunarity: 2.0,
      gain: 0.5,
    }),
  },
  {
    heading: 'Ridge Noise',
    options: createNoiseSettings('ridgeNoise', {
      scale: 4000, // Corresponds to maximum `hilliness`
      frequency: 0.024,
      octaves: 10,
      lacunarity: 2,
      gain: 0.55,
    }),
  },
];

/** Smaller map for tests */
export const terrainGenControlsTest = produce(terrainGenControls, (draft) => {
  const generalOptions = draft[0].options;
  const widthOption = generalOptions.find(({ key }) => key === 'width');
  if (widthOption) {
    widthOption.value = 200;
  }
  const heightOption = generalOptions.find(({ key }) => key === 'height');
  if (heightOption) {
    heightOption.value = 100;
  }
  const numPlates = generalOptions.find(({ key }) => key === 'numPlates');
  if (numPlates) {
    numPlates.value = 5;
  }
});

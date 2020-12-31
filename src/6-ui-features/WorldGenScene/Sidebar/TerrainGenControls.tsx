import React from 'react';
import styled from '@emotion/styled';
import { PrimaryButton } from '6-ui-features/DesignSystem/buttons/PrimaryButton';
import { SliderOptionProps, SliderOptions } from './SliderOptions';
import { createNoiseSettings } from './createNoiseSettings';

const terrainOptions: SliderOptionProps[] = [
  {
    name: 'Width (tiles)',
    description: 'Map width in tiles. 1 tile = 4092 m.',
    defaultVal: 800,
    min: 100,
    max: 1000,
    step: 50,
  },
  {
    name: 'Height (tiles)',
    description: 'Map height in tiles. 1 tile = 4092 m.',
    defaultVal: 400,
    min: 100,
    max: 1000,
    step: 50,
  },
  {
    name: 'Tectonic Plates',
    description: 'Number of tectonic plates.',
    defaultVal: 7,
    min: 5,
    max: 30,
    step: 1,
  },
  {
    name: 'Percent Ocean',
    description:
      'Percent of plates that are oceanic. When set to 0, all plates will be continental.',
    defaultVal: 0.65,
    min: 0,
    max: 100,
    step: 1,
  },

  /** Noise settings for fault perturbation */
  ...createNoiseSettings({
    scale: 425,
    frequency: 2 * 10 ** -4,
    octaves: 10,
    lacunarity: 1.85,
    gain: 0.53,
  }),
];

export function TerrainGenControls(): JSX.Element {
  return (
    <>
      <SliderOptions options={terrainOptions} />
      <LastRow>
        <PrimaryButton>Go!</PrimaryButton>
      </LastRow>
    </>
  );
}

const LastRow = styled.div`
  display: flex;
  margin: 0.5em;
  justify-content: flex-end;
`;

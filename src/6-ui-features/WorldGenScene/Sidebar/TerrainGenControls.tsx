import React from 'react';
import styled from '@emotion/styled';
import { PrimaryButton } from '6-ui-features/DesignSystem/buttons/PrimaryButton';
import { getColor } from '6-ui-features/Theme';
import { SliderOptionProps, SliderOptions } from './SliderOptions';
import { createNoiseSettings } from './createNoiseSettings';

const generalOptions: SliderOptionProps[] = [
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
    min: 50,
    max: 500,
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
    defaultVal: 65,
    min: 0,
    max: 100,
    step: 1,
  },
];

/** Noise settings for fault perturbation */
const faultPerturbationSettings = createNoiseSettings({
  scale: 425,
  frequency: 2 * 10 ** -4,
  octaves: 10,
  lacunarity: 1.85,
  gain: 0.53,
});

const faultFeatureSettings: SliderOptionProps[] = [
  {
    name: 'Coast Slope',
    description:
      'Average slope of coastal areas. A low value means large coastal areas, beaches, and continental shelves.',
    defaultVal: 50 / 100000,
    min: 5 / 100000,
    max: 100 / 100000,
    step: 5 / 100000,
  },
  {
    name: 'Mountain Slope',
    description:
      'Average slope of mountains. A low value leads to large mountainous regions, but the generator may have difficulty fitting them in.',
    defaultVal: 0.01,
    min: 0.002,
    max: 0.02,
    step: 0.01,
  },
  {
    name: 'Rift Slope',
    description:
      "Average slope of rifts. You won't interact with this much since most rifts are underwater.",
    defaultVal: 0.01,
    min: 0.002,
    max: 0.02,
    step: 0.01,
  },
];

const lowFreqNoiseSettings = createNoiseSettings({
  scale: 2000,
  frequency: 0.003,
  octaves: 8,
  lacunarity: 2.0,
  gain: 0.5,
});

const ridgeNoiseSettings = createNoiseSettings({
  scale: 5000, // Corresponds to maximum `hilliness`
  frequency: 0.012,
  octaves: 10,
  lacunarity: 2,
  gain: 0.55,
});

export function TerrainGenControls(): JSX.Element {
  return (
    <>
      <Heading>General</Heading>
      <SliderOptions options={generalOptions} />
      <Heading>Fault Shape</Heading>
      <SliderOptions options={faultPerturbationSettings} />
      <Heading>Fault Features</Heading>
      <SliderOptions options={faultFeatureSettings} />
      <Heading>Low Frequency Noise</Heading>
      <SliderOptions options={lowFreqNoiseSettings} />
      <Heading>Ridge Noise</Heading>
      <SliderOptions options={ridgeNoiseSettings} />
      <LastRow>
        <PrimaryButton>Go!</PrimaryButton>
      </LastRow>
    </>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <HeadingContainer>
      <h4>{children}</h4>
      <HeadingRight>
        <HeadingRightTop />
        <HeadingRightBottom />
      </HeadingRight>
    </HeadingContainer>
  );
}

const HeadingContainer = styled.div`
  margin-top: 0.5em;
  display: flex;
  align-items: stretch;
`;

const HeadingRight = styled.div`
  flex: 1 0 0;
  margin: 0 1em;

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const HeadingRightTop = styled.div`
  flex: 0 0 55%;
  box-sizing: border-box;
  border-bottom: 1px solid ${getColor('white')};
`;

const HeadingRightBottom = styled.div`
  flex: 0 0 45%;
`;

const LastRow = styled.div`
  display: flex;
  margin: 0.5em;
  justify-content: flex-end;
`;

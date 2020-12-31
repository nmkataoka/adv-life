import React from 'react';
import styled from '@emotion/styled';
import { PrimaryButton } from '6-ui-features/DesignSystem/buttons/PrimaryButton';
import { getColor } from '6-ui-features/Theme';
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
];

/** Noise settings for fault perturbation */
const faultPerturbationSettings = createNoiseSettings({
  scale: 425,
  frequency: 2 * 10 ** -4,
  octaves: 10,
  lacunarity: 1.85,
  gain: 0.53,
});

export function TerrainGenControls(): JSX.Element {
  return (
    <>
      <Heading>General</Heading>
      <SliderOptions options={terrainOptions} />
      <Heading>Fault Shape</Heading>
      <SliderOptions options={faultPerturbationSettings} />
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

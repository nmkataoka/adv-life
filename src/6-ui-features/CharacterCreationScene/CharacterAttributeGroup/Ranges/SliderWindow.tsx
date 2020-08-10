import React from 'react';
import styled from '@emotion/styled';
import Window from '../../components/Window';
import SliderRow, { SliderRowProps } from './SliderRow';

type SliderWindowProps = {
  header: string;
  sliders: SliderRowProps[];
}

export default function SliderWindow({ header, sliders }: SliderWindowProps): JSX.Element {
  return (
    <Window header={header} randomize showNavigation>
      <SliderContainer>
        {sliders.map(({
          info,
          max,
          maxLabel,
          min,
          minLabel,
          step,
          value,
        }) => (
          <SliderRow
            info={info}
            key={maxLabel}
            max={max}
            maxLabel={maxLabel}
            min={min}
            minLabel={minLabel}
            step={step}
            value={value}
          />
        ))}
      </SliderContainer>
    </Window>
  );
}

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

import React from 'react';
import styled from '@emotion/styled';
import Window from './Window';
import Header from './Header';
import SliderRow, { SliderRowProps } from './SliderRow';

type SliderWindowProps = {
  header: string;
  sliders: SliderRowProps[];
}

export default function SliderWindow({ header, sliders }: SliderWindowProps): JSX.Element {
  return (
    <Window showNavigation>
      <Header>{header}</Header>
      <SliderContainer>
        {sliders.map(({
          info,
          max,
          maxLabel,
          min,
          minLabel,
          onChange,
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
            onChange={onChange}
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

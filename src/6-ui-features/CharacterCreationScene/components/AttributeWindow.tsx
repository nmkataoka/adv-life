import React from 'react';
import styled from '@emotion/styled';
import Window from './Window';
import Header from './Header';
import AttributeRow, { AttributeRowProps } from './AttributeRow';

type AttributewindowProps = {
  attributes: AttributeRowProps[],
  header: string;
}

export default function AttributeWindow({ attributes, header }: AttributewindowProps): JSX.Element {
  return (
    <Window showNavigation>
      <Header>{header}</Header>
      <AttributeContainer>
        {attributes.map(({
          label,
          min,
          max,
          onDecrease,
          onIncrease,
          value,
        }) => (
          <AttributeRow
            key={label}
            label={label}
            min={min}
            max={max}
            value={value}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />
        ))}
      </AttributeContainer>
    </Window>
  );
}

const AttributeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
